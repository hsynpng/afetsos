import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# .env dosyasını yükle
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("HATA: GEMINI_API_KEY bulunamadı!")
else:
    try:
        genai.configure(api_key=api_key)
        print("--- Erişilebilir Gemini Modelleri ---\n")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"Model Adı: {m.name}")
        print("\n-------------------------------------")
    except Exception as e:
        print(f"Hata oluştu: {e}")
