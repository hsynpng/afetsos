import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from pathlib import Path

# backend klasöründeki .env dosyasını bul
env_path = Path(__file__).resolve().parent.parent.parent / ".env"

if not env_path.exists():
    print(f"UYARI: .env dosyası bulunamadı! Beklenen konum: {env_path}")
else:
    print(f"BİLGİ: .env dosyası yüklendi: {env_path}")

load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    APP_NAME: str = os.getenv("APP_NAME", "AFETSOS-API")
    DEBUG: bool = (os.getenv("DEBUG", "True") == "True")
    
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")

    class Config:
        extra = "allow"

settings = Settings()
