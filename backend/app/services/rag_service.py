from openai import OpenAI
import json
import re
from .ingestion_service import get_vector_store
from ..config import get_settings

settings = get_settings()

QUESTION_GENERATION_PROMPT = """
You are a senior technical interviewer conducting an interview 
for a {role} position.

Candidate profile:
- Skills: {skills}
- Technologies: {technologies}
- Experience level: {experience_level}
- Domain exposure: {domains}

Knowledge context (use this to ground your question):
{context}

Questions already asked:
{previous_questions}

Interview progress: Question {current} of {total}

Generate ONE technical interview question that:
1. Is grounded in the knowledge context above
2. Is appropriate for {experience_level} level
3. Is different from all previously asked questions
4. Progressively increases in depth (early questions = conceptual, later = applied/problem-solving)
5. Is specific, not generic

Respond ONLY in this JSON format:
{{
  "question_text": "the full question",
  "domain": "specific topic domain (e.g. 'gradient descent')",
  "difficulty": "easy|medium|hard",
  "expected_concepts": ["concept1", "concept2"]
}}
"""

def retrieve_context(role: str, resume_data: dict, previous_domains: list[str]):
    skills = resume_data.get('extracted_skills', [])
    techs = resume_data.get('extracted_technologies', [])
    exp = resume_data.get('experience_level', 'unknown')
    
    query = f"""
    {role} engineer interview topics.
    Candidate skills: {', '.join(skills)}.
    Technologies known: {', '.join(techs)}.
    Experience level: {exp}.
    Avoid these already-covered domains: {', '.join(previous_domains)}
    """
    
    vector_store = get_vector_store(role)
    docs = vector_store.similarity_search(query, k=5)
    
    return [{"text": doc.page_content, "source": doc.metadata.get("source", "unknown")} for doc in docs]

async def generate_question(role: str, resume_data: dict, context_chunks: list[dict], previous_questions: list[str], question_index: int):
    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=settings.hf_token,
    )

    context_text = "\n---\n".join([c["text"] for c in context_chunks])
    
    skills = resume_data.get('extracted_skills', [])
    techs = resume_data.get('extracted_technologies', [])
    exp = resume_data.get('experience_level', 'unknown')
    domains = resume_data.get('domain_exposure', [])

    prompt = QUESTION_GENERATION_PROMPT.format(
        role=role,
        skills=", ".join(skills),
        technologies=", ".join(techs),
        experience_level=exp,
        domains=", ".join(domains),
        context=context_text if context_text else "No additional context available.",
        previous_questions="\n".join(previous_questions) if previous_questions else "None",
        current=question_index + 1,
        total=settings.max_questions_per_session
    )

    completion = client.chat.completions.create(
        model="Qwen/Qwen2.5-7B-Instruct:together",
        messages=[
            {"role": "system", "content": "You are a senior technical interviewer. Respond only in JSON."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    response_text = completion.choices[0].message.content

    json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
    if json_match:
        return json.loads(json_match.group())
    else:
        raise Exception(f"Failed to generate question JSON. Response: {response_text[:100]}")
