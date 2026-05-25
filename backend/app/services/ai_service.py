import google.generativeai as genai
import json
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

class AIService:
    def __init__(self):
        print("[DEBUG] AI Servisi başlatılıyor. Model: models/gemini-2.5-flash")
        self.model = genai.GenerativeModel('models/gemini-2.5-flash')

    async def analyze_emergency_message(self, message: str, voice_url: str = None):
        print(f"[DEBUG] Analiz Başladı. Mesaj: '{message}', Ses URL: {voice_url}")
        
        prompt = """
        Sen profesyonel bir afet analiz uzmanısın. Kullanıcının gönderdiği MESAJI ve SESLİ NOTU analiz et.
        
        GÖREVLERİN:
        1. SESLİ NOTU DİNLE: Eğer ses varsa, içindeki konuşmayı birebir yazıya dök ve 'transcription' alanına yaz.
        2. CÜMLEYİ TOPARLA: Eğer hem mesaj hem ses varsa, ikisini birleştirerek anlamlı ve temiz bir özet oluştur.
        3. ANALİZ ET: Aciliyet durumunu (Low, Medium, High, Critical) ve diğer detayları belirle.
        
        KESİNLİKLE AÇIKLAMA YAPMA, SADECE BU FORMATTA JSON DÖNDÜR:
        {
            "urgency": "Low/Medium/High/Critical",
            "need_type": "...",
            "victim_count": 1,
            "health_status": "...",
            "floor_number": "...",
            "infrastructure_damage": "...",
            "location_context": "...",
            "transcription": "Buraya sesli notun veya mesajın toparlanmış halini yaz."
        }
        """
        
        inputs = [prompt]
        
        # Ses verisini indir ve kontrol et
        if voice_url:
            import httpx
            try:
                print(f"[DEBUG] Ses dosyası indiriliyor: {voice_url}")
                async with httpx.AsyncClient() as client:
                    resp = await client.get(voice_url)
                    if resp.status_code == 200:
                        audio_content = resp.content
                        # Uzantıya göre mime_type belirle (m4a, mp4 -> audio/mp4)
                        mime_type = "audio/mp4"
                        if voice_url.lower().endswith(".3gp"):
                            mime_type = "audio/3gpp"
                        
                        print(f"[DEBUG] Gemini'ye gönderilen MIME: {mime_type}")
                        inputs.append({
                            "mime_type": mime_type,
                            "data": audio_content
                        })
                    else:
                        print(f"[DEBUG] Ses indirme başarısız! Status: {resp.status_code}")
            except Exception as e:
                print(f"[DEBUG] Ses indirme hatası: {str(e)}")

        if message:
            inputs.append(f"Kullanıcı Metin Mesajı: {message}")

        try:
            print("[DEBUG] Yapay zekaya istek gönderiliyor...")
            response = self.model.generate_content(inputs)
            text = response.text.replace("```json", "").replace("```", "").strip()
            print(f"[DEBUG] Yapay Zeka Ham Yanıt: {text}")
            
            result = json.loads(text)
            return result
        except Exception as e:
            print(f"[DEBUG] AI Analiz Hatası: {str(e)}")
            return {
                "urgency": "Medium",
                "need_type": "Genel Yardım",
                "victim_count": 1,
                "health_status": "Bilinmiyor",
                "floor_number": None,
                "infrastructure_damage": None,
                "location_context": None,
                "transcription": message if message else "Sesli not analiz edilemedi."
            }

ai_service = AIService()
