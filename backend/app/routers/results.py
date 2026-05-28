from fastapi import APIRouter, Depends, HTTPException
import google.generativeai as genai
import json
import re
from ..database import get_database
from ..services import session_service
from ..config import get_settings

router = APIRouter(prefix="/results", tags=["results"])
settings = get_settings()

SUMMARY_PROMPT = """
Analyze this technical interview transcript and provide 
a structured evaluation.

Role: {role}
Candidate: {candidate_name}

Q&A Transcript:
{transcript}

Respond ONLY in this JSON format:
{{
  "overall_rating": "Strong|Good|Average|Needs Improvement",
  "score": number between 0-100,
  "strengths": ["list of demonstrated strengths"],
  "gaps": ["list of knowledge gaps identified"],
  "topic_performance": [
    {{"topic": "string", "assessment": "string"}}
  ],
  "recommendation": "Proceed|Hold|Reject",
  "summary_text": "2-3 sentence overall summary"
}}
"""

@router.get("/{session_id}")
async def get_results(session_id: str, db = Depends(get_database)):
    session = await session_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    questions = await session_service.get_session_questions(db, session_id)
    
    transcript = ""
    for q in questions:
        transcript += f"Q: {q['question_text']}\nA: {q.get('candidate_answer', 'No answer provided')}\n\n"
        
    genai.configure(api_key=settings.raw_gemini_api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = SUMMARY_PROMPT.format(
        role=session["role"],
        candidate_name=session["candidate_name"],
        transcript=transcript
    )
    
    response = model.generate_content(prompt)
    response_text = response.text
    
    json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
    if json_match:
        evaluation = json.loads(json_match.group())
    else:
        raise HTTPException(status_code=500, detail="Failed to generate evaluation")
        
    return {
        "session": {
            "session_id": session["session_id"],
            "candidate_name": session["candidate_name"],
            "role": session["role"],
            "status": session["status"],
            "created_at": session["created_at"],
            "completed_at": session.get("completed_at")
        },
        "transcript": [
            {
                "question": q["question_text"],
                "answer": q.get("candidate_answer"),
                "domain": q["domain"]
            } for q in questions
        ],
        "evaluation": evaluation
    }
