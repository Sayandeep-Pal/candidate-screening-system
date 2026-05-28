from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from ..services.resume_parser import parse_resume
from ..database import get_database
from ..models.resume import ResumeCreate
from datetime import datetime

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), db = Depends(get_database)):
    print(f"DEBUG: Starting upload for {file.filename}")
    content = await file.read()
    try:
        print("DEBUG: Calling parse_resume")
        parsed_data = await parse_resume(content, file.filename)
        print(f"DEBUG: Parsed data: {parsed_data}")
        
        resume_doc = ResumeCreate(
            candidate_name=parsed_data["candidate_name"],
            raw_text=parsed_data["raw_text"],
            extracted_skills=parsed_data["skills"],
            extracted_technologies=parsed_data["technologies"],
            experience_level=parsed_data["experience_level"],
            domain_exposure=parsed_data["domain_exposure"]
        )
        print("DEBUG: ResumeCreate object created")
        
        await db.resumes.insert_one(resume_doc.dict())
        print("DEBUG: Inserted into MongoDB")
        
        return {
            "resume_id": resume_doc.resume_id,
            "candidate_name": resume_doc.candidate_name,
            "skills": resume_doc.extracted_skills,
            "technologies": resume_doc.extracted_technologies,
            "experience_level": resume_doc.experience_level,
            "domain_exposure": resume_doc.domain_exposure
        }
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse resume: {str(e)}")
