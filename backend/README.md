# InterviewAI Backend

Production-grade backend for an AI-powered candidate screening and interview system.

## Stack
- Python 3.11+
- FastAPI (Async)
- MongoDB with Motor (Async)
- Google Gemini API (LLM & Embeddings)
- ChromaDB (Local Vector Store)
- LangChain (RAG Orchestration)

## Setup

1. **Prerequisites**
   - Python 3.11+
   - MongoDB running locally (default: `mongodb://localhost:27017`)
   - Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

2. **Installation**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your `GEMINI_API_KEY`

4. **Knowledge Base**
   - Place relevant PDF files in the `knowledge_base/` directory.
   - Default mapping expects:
     - `aiml`: `mitchell_ml.pdf`, `burkov_100page.pdf`
     - `datascience`: `intro_ml_python.pdf`, `brownlee_algorithms.pdf`
     - `backend`: `mitchell_ml.pdf`

5. **Run the Server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## API Documentation
Once the server is running, visit:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Architecture
1. **Resume Parsing**: Uses Gemini Flash to extract structured JSON from uploaded resumes.
2. **RAG Pipeline**: Ingests technical PDFs into ChromaDB. During interviews, it retrieves relevant context to ground technical questions.
3. **Adaptive Interviewing**: Generates questions that increase in depth based on candidate profile and previous answers.
4. **Automated Evaluation**: Provides a comprehensive summary, rating, and recommendation after session completion.
