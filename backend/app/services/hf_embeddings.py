from sentence_transformers import SentenceTransformer
from typing import List
from langchain_core.embeddings import Embeddings

class HuggingFaceInferenceEmbeddings(Embeddings):
    def __init__(self, model_id: str = "BAAI/bge-small-en-v1.5"):
        self.model = SentenceTransformer(model_id)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed search docs."""
        embeddings = self.model.encode(texts, batch_size=32)
        return embeddings.tolist()

    def embed_query(self, text: str) -> List[float]:
        """Embed query text."""
        embedding = self.model.encode(text)
        return embedding.tolist()
