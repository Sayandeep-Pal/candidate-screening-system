from fastapi import APIRouter, Depends, HTTPException
from ..database import get_database
from ..services import session_service, rag_service
from ..models.question import AnswerRequest, QuestionCreate
from ..config import get_settings

router = APIRouter(prefix="/interview", tags=["interview"])
settings = get_settings()

@router.get("/{session_id}/current-question")
async def get_current_question(session_id: str, db = Depends(get_database)):
    session = await session_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session["status"] != "active":
        raise HTTPException(status_code=400, detail="Session is not active")
    
    question = await db.questions.find_one({
        "session_id": session_id,
        "question_index": session["current_question_index"]
    })
    
    return {
        "question_id": str(question["question_index"]),
        "question_text": question["question_text"],
        "domain": question["domain"],
        "question_index": question["question_index"],
        "total_questions": session["total_questions"]
    }

@router.post("/{session_id}/answer")
async def submit_answer(session_id: str, request: AnswerRequest, db = Depends(get_database)):
    session = await session_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    current_index = session["current_question_index"]
    
    # 1. Save answer
    await session_service.save_answer(db, session_id, current_index, request.answer_text)
    
    # 2. Check if interview complete
    if current_index + 1 >= session["total_questions"]:
        await session_service.complete_session(db, session_id)
        return {"status": "completed", "session_id": session_id}
    
    # 3. Generate next question
    resume = await db.resumes.find_one({"resume_id": session["resume_id"]})
    previous_questions = await db.questions.find({"session_id": session_id}).to_list(length=100)
    
    previous_texts = [q["question_text"] for q in previous_questions]
    previous_domains = [q["domain"] for q in previous_questions]
    
    context = rag_service.retrieve_context(session["role"], resume, previous_domains)
    next_question_data = await rag_service.generate_question(
        session["role"],
        resume,
        context,
        previous_texts,
        current_index + 1
    )
    
    # 4. Save next question
    next_question_doc = QuestionCreate(
        session_id=session_id,
        question_index=current_index + 1,
        question_text=next_question_data["question_text"],
        domain=next_question_data["domain"],
        source_chunks=[c["text"] for c in context]
    )
    await db.questions.insert_one(next_question_doc.dict())
    
    # 5. Update session progress
    await session_service.update_session_progress(db, session_id, current_index + 1)
    
    return {
        "status": "next",
        "next_question": {
            "question_id": str(next_question_doc.question_index),
            "question_text": next_question_doc.question_text,
            "domain": next_question_doc.domain
        }
    }
