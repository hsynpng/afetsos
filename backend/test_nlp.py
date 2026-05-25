import asyncio
import sys
import os

# Backend dizinini sys.path'e ekliyoruz ki app modülünü bulabilsin
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.ai_service import ai_service
import json

async def run_test():
    print("=== AFETSOS Doğal Dil İşleme (NLP) Test Uygulaması ===\n")
    
    # Test için örnek bir acil durum mesajı
    sample_message = "Şifa mahallesi 14. sokakta 3 katlı bina çöktü, içeride 4 kişi var biri ağır yaralı çok acil yardım lazım her yer yıkık dökük!"
    
    print(f"Gelen Ham Mesaj:\n\"{sample_message}\"\n")
    print("Yapay Zeka (Gemini) analiz ediyor... Lütfen bekleyin.\n")
    
    try:
        # ai_service'i kullanarak mesajı analiz ediyoruz
        result = await ai_service.analyze_emergency_message(message=sample_message)
        
        print("=== NLP Analiz Çıktısı (JSON) ===")
        print(json.dumps(result, indent=4, ensure_ascii=False))
        
        print("\n=== Çıkarılan Temel Bilgiler ===")
        print(f"Aciliyet Seviyesi : {result.get('urgency')}")
        print(f"İhtiyaç Türü      : {result.get('need_type')}")
        print(f"Kişi Sayısı       : {result.get('victim_count')}")
        print(f"Sağlık Durumu     : {result.get('health_status')}")
        print(f"Bina Durumu       : {result.get('infrastructure_damage')}")
        print(f"Konum/Kat         : {result.get('floor_number')}")
        
    except Exception as e:
        print(f"Hata oluştu: {e}")

if __name__ == "__main__":
    # Asyncio loop başlat
    asyncio.run(run_test())
