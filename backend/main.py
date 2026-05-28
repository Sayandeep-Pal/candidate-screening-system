from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.database import connect_to_mongo, close_mongo_connection
from app.services.ingestion_service import ingest_knowledge_base
from app.routers import session, resume, interview, results

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="InterviewAI API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(resume.router, prefix="/api")
app.include_router(session.router, prefix="/api")
app.include_router(interview.router, prefix="/api")
app.include_router(results.router, prefix="/api")

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    logger.info("Connected to MongoDB")
    
    # Run ingestion
    try:
        ingestion_results = await ingest_knowledge_base()
        logger.info(f"Ingestion completed: {ingestion_results}")
    except Exception as e:
        logger.error(f"Ingestion failed: {str(e)}")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()
    logger.info("Disconnected from MongoDB")

@app.get("/")
async def health_check():
    return {"status": "ok", "version": "1.0.0", "message": "InterviewAI API is running"}

# Global Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc)},
    )
