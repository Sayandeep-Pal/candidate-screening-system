from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class QuestionBase(BaseModel):
    session_id: str
    question_index: int
    question_text: str
    domain: str
    source_chunks: List[str] = []

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    candidate_answer: Optional[str] = None
    answered_at: Optional[datetime] = None

class AnswerRequest(BaseModel):
    question_id: str
    answer_text: str
