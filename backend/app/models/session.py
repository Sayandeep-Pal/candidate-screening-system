from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

class SessionBase(BaseModel):
    candidate_name: str
    role: str
    resume_id: str
    status: str = "active"
    current_question_index: int = 0
    total_questions: int = 8

class SessionCreate(SessionBase):
    session_id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Session(SessionCreate):
    completed_at: Optional[datetime] = None
