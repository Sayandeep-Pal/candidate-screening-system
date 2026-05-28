import os
import pdfplumber
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .hf_embeddings import HuggingFaceInferenceEmbeddings
from langchain_community.vectorstores import Chroma
from ..config import get_settings

settings = get_settings()

ROLE_PDF_MAPPING = {
    "aiml": ["mitchell_ml.pdf", "burkov_100page.pdf"],
    "datascience": ["intro_ml_python.pdf", "brownlee_algorithms.pdf"],
    "backend": ["mitchell_ml.pdf"]
}

def get_vector_store(role: str) -> Chroma:
    embeddings = HuggingFaceInferenceEmbeddings()
    return Chroma(
        collection_name=role,
        embedding_function=embeddings,
        persist_directory=settings.chroma_persist_dir
    )

async def ingest_knowledge_base() -> dict[str, int]:
    results = {}
    
    embeddings = HuggingFaceInferenceEmbeddings()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap
    )

    for role, pdfs in ROLE_PDF_MAPPING.items():
        vector_store = Chroma(
            collection_name=role,
            embedding_function=embeddings,
            persist_directory=settings.chroma_persist_dir
        )
        
        # Check if already ingested
        if vector_store._collection.count() > 0:
            results[role] = vector_store._collection.count()
            continue

        all_chunks = []
        for pdf_name in pdfs:
            pdf_path = os.path.join(settings.knowledge_base_dir, pdf_name)
            if not os.path.exists(pdf_path):
                print(f"Warning: {pdf_path} not found. Skipping.")
                continue

            print(f"Ingesting {pdf_name} for role {role}...")
            with pdfplumber.open(pdf_path) as pdf:
                total_pages = len(pdf.pages)
                for i, page in enumerate(pdf.pages):
                    if i % 10 == 0:
                        print(f"  [{role}] Processing page {i}/{total_pages} of {pdf_name}...")
                    text = page.extract_text()
                    if text:
                        chunks = text_splitter.split_text(text)
                        for chunk in chunks:
                            all_chunks.append({
                                "text": chunk,
                                "metadata": {"source": pdf_name, "page": i + 1}
                            })
        
        if all_chunks:
            print(f"Adding {len(all_chunks)} chunks to {role} vector store...")
            texts = [c["text"] for c in all_chunks]
            metadatas = [c["metadata"] for c in all_chunks]
            
            # Batch embedding to prevent 504 Deadline Exceeded
            # Using smaller batch size and adding a small delay
            batch_size = 50
            import time
            for i in range(0, len(texts), batch_size):
                print(f"  [{role}] Embedding batch {i//batch_size + 1}/{(len(texts) + batch_size - 1)//batch_size}...")
                batch_texts = texts[i:i + batch_size]
                batch_metadatas = metadatas[i:i + batch_size]
                try:
                    vector_store.add_texts(texts=batch_texts, metadatas=batch_metadatas)
                except Exception as e:
                    print(f"  [{role}] Error in batch {i//batch_size + 1}: {str(e)}. Retrying in 5s...")
                    time.sleep(5)
                    vector_store.add_texts(texts=batch_texts, metadatas=batch_metadatas)
                
                time.sleep(0.5) # Small cooldown
                
            results[role] = len(all_chunks)
            print(f"Successfully ingested {role}.")
            
    return results
