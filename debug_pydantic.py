import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr

class Settings(BaseSettings):
    gemini_api_key: str
    model_config = SettingsConfigDict(env_file="backend/.env", extra="ignore")

settings = Settings()
print(f"Type of gemini_api_key: {type(settings.gemini_api_key)}")
print(f"Value (masked if SecretStr): {settings.gemini_api_key}")

if hasattr(settings.gemini_api_key, 'get_secret_value'):
    print("Has get_secret_value")
else:
    print("Does not have get_secret_value")
