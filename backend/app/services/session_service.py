from datetime import datetime
from uuid import uuid4
from ..models.session import SessionCreate, Session
from ..models.question import QuestionCreate, Question

async def create_session(db, role: str, resume_id: str, candidate_name: str):
    session_data = SessionCreate(
        candidate_name=candidate_name,
        role=role,
        resume_id=resume_id
    )
    await db.sessions.insert_one(session_data.dict())
    return session_data

async def get_session(db, session_id: str):
    return await db.sessions.find_one({"session_id": session_id})

async def update_session_progress(db, session_id: str, question_index: int):
    await db.sessions.update_one(
        {"session_id": session_id},
        {"$set": {"current_question_index": question_index}}
    )

async def complete_session(db, session_id: str):
    await db.sessions.update_one(
        {"session_id": session_id},
        {"$set": {
            "status": "completed",
            "completed_at": datetime.utcnow()
        }}
    )

async def save_answer(db, session_id: str, question_index: int, answer_text: str):
    await db.questions.update_one(
        {"session_id": session_id, "question_index": question_index},
        {"$set": {
            "candidate_answer": answer_text,
            "answered_at": datetime.utcnow()
        }}
    )

async def get_session_questions(db, session_id: str):
    cursor = db.questions.find({"session_id": session_id}).sort("question_index", 1)
    return await cursor.to_list(length=100)
