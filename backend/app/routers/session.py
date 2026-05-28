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
    print(f"DEBUG: Creating session for resume_id: {request.resume_id}, role: {request.role}")
    # 1. Fetch resume
    resume = await db.resumes.find_one({"resume_id": request.resume_id})
    if not resume:
        print(f"DEBUG: Resume not found for id: {request.resume_id}")
        raise HTTPException(status_code=404, detail="Resume not found")
    
    print(f"DEBUG: Found resume for {resume.get('candidate_name')}")
    # 2. Create session
    try:
        session = await session_service.create_session(
            db, 
            request.role, 
            request.resume_id, 
            resume["candidate_name"]
        )
        print(f"DEBUG: Session created: {session.session_id}")
    except Exception as e:
        print(f"DEBUG: Failed to create session record: {str(e)}")
        raise e
    
    # 3. Pre-generate first question
    try:
        print("DEBUG: Retrieving context")
        context = rag_service.retrieve_context(request.role, resume, [])
        print(f"DEBUG: Retrieved {len(context)} context chunks")
        
        print("DEBUG: Generating first question")
        question_data = await rag_service.generate_question(
            request.role, 
            resume, 
            context, 
            [], 
            0
        )
        print(f"DEBUG: Generated question: {question_data.get('question_text')[:50]}...")
    except Exception as e:
        print(f"DEBUG: Failed to generate question: {str(e)}")
        raise e
    
    # 4. Save question
    try:
        question_doc = QuestionCreate(
            session_id=session.session_id,
            question_index=0,
            question_text=question_data["question_text"],
            domain=question_data["domain"],
            source_chunks=[c["text"] for c in context]
        )
        await db.questions.insert_one(question_doc.dict())
        print("DEBUG: Question saved to DB")
    except Exception as e:
        print(f"DEBUG: Failed to save question: {str(e)}")
        raise e
    
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
