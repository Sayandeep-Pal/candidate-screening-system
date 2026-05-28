from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from uuid import uuid4

class ResumeBase(BaseModel):
    raw_text: str
    extracted_skills: List[str]
    extracted_technologies: List[str]
    experience_level: str
    domain_exposure: List[str]

class ResumeCreate(ResumeBase):
    resume_id: str = Field(default_factory=lambda: str(uuid4()))
    candidate_name: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class Resume(ResumeCreate):
    pass
