import pdfplumber
import google.generativeai as genai
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

    genai.configure(api_key=settings.raw_gemini_api_key)
    # Use JSON mode for reliable output
    model = genai.GenerativeModel(
        "gemini-flash-latest",
        generation_config={"response_mime_type": "application/json"}
    )
    
    prompt = EXTRACTION_PROMPT.format(resume_text=raw_text)
    
    try:
        response = model.generate_content(prompt)
        extracted_data = json.loads(response.text)
    except Exception as e:
        # Fallback to manual cleaning if JSON mode fails or returns unexpected format
        response_text = response.text if 'response' in locals() else str(e)
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
