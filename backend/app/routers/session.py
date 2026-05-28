from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..database import get_database
from ..services import session_service, rag_service
from ..models.question import QuestionCreate

router = APIRouter(prefix="/session", tags=["session"])

class SessionCreateRequest(BaseModel):
    resume_id: str
    role: str

@router.post("/create")
async def create_session(request: SessionCreateRequest, db = Depends(get_database)):
    # 1. Fetch resume
    resume = await db.resumes.find_one({"resume_id": request.resume_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # 2. Create session
    session = await session_service.create_session(
        db, 
        request.role, 
        request.resume_id, 
        resume["candidate_name"]
    )
    
    # 3. Pre-generate first question
    context = rag_service.retrieve_context(request.role, resume, [])
    question_data = await rag_service.generate_question(
        request.role, 
        resume, 
        context, 
        [], 
        0
    )
    
    # 4. Save question
    question_doc = QuestionCreate(
        session_id=session.session_id,
        question_index=0,
        question_text=question_data["question_text"],
        domain=question_data["domain"],
        source_chunks=[c["text"] for c in context]
    )
    await db.questions.insert_one(question_doc.dict())
    
    return {
        "session_id": session.session_id,
        "candidate_name": session.candidate_name,
        "role": session.role,
        "first_question": {
            "question_id": str(question_doc.question_index),
            "question_text": question_doc.question_text,
            "domain": question_doc.domain
        }
    }

@router.get("/{session_id}/status")
async def get_session_status(session_id: str, db = Depends(get_database)):
    session = await session_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "status": session["status"],
        "current_question_index": session["current_question_index"],
        "total_questions": session["total_questions"]
    }
