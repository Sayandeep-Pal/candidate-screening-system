import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)
model = genai.GenerativeModel(
    "gemini-flash-latest",
    generation_config={"response_mime_type": "application/json"}
)

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
Name: John Doe. Experience: 5 years in Python.
"""

response = model.generate_content(EXTRACTION_PROMPT)
print(f"RESPONSE TEXT:\n{response.text}")
try:
    data = json.loads(response.text)
    print("PARSED DATA:")
    print(data)
except Exception as e:
    print(f"ERROR: {e}")
