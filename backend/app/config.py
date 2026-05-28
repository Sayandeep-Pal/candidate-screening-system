from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    gemini_api_key: str
    hf_token: str
    mongodb_uri: str
    mongodb_db_name: str
    chroma_persist_dir: str
    knowledge_base_dir: str
    max_questions_per_session: int = 8
    chunk_size: int = 800
    chunk_overlap: int = 100
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def raw_gemini_api_key(self) -> str:
        # Failsafe to ensure we always get a plain string
        val = self.gemini_api_key
        if hasattr(val, 'get_secret_value'):
            return val.get_secret_value()
        return str(val)

@lru_cache()
def get_settings():
    return Settings()
