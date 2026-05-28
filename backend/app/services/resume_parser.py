import pdfplumber
from openai import OpenAI
import json
import re
from ..config import get_settings

settings = get_settings()

EXTRACTION_PROMPT = """
Analyze this resume and extract the following in JSON format only.
No explanation, just valid JSON:
{{
  "candidate_name": "string",
  "skills": ["list of technical skills"],
  "technologies": ["frameworks, tools, languages"],
  "experience_level": "junior|mid|senior",
  "domain_exposure": ["domains like ML, web dev, data, etc."],
  "years_experience": number or null
}}

Resume text:
{resume_text}
"""

async def parse_resume(file_bytes: bytes, filename: str) -> dict:
    raw_text = ""
    if filename.endswith(".pdf"):
        import io
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                raw_text += (page.extract_text() or "") + "\n"
    else:
        raw_text = file_bytes.decode("utf-8")

    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=settings.hf_token,
    )

    prompt = EXTRACTION_PROMPT.format(resume_text=raw_text)

    try:
        completion = client.chat.completions.create(
            model="Qwen/Qwen2.5-7B-Instruct:together",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that outputs only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        response_text = completion.choices[0].message.content
        extracted_data = json.loads(response_text)
    except Exception as e:
        # Fallback to manual cleaning if JSON mode fails or returns unexpected format
        response_text = completion.choices[0].message.content if 'completion' in locals() else str(e)
        clean_json = response_text
        if "```json" in response_text:
            clean_json = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            clean_json = response_text.split("```")[1].split("```")[0]
        
        json_match = re.search(r"\{.*\}", clean_json, re.DOTALL)
        if json_match:
            extracted_data = json.loads(json_match.group())
        else:
            raise Exception(f"Failed to parse resume JSON: {str(e)}")
    
    extracted_data["raw_text"] = raw_text
    return extracted_data
