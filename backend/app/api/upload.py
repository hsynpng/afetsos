from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid
from app.core.supabase_client import supabase

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/voice")
async def upload_voice(file: UploadFile = File(...)):
    try:
        # 1. Dosya adını benzersiz yap
        file_extension = file.filename.split(".")[-1] if "." in file.filename else "m4a"
        file_name = f"voice_{uuid.uuid4()}.{file_extension}"
        
        # 2. Dosya içeriğini oku
        file_content = await file.read()
        
        # 3. Supabase Storage'a yükle (bucket adı: 'voice_notes' olmalı)
        # Önce bucket var mı kontrol etmek gerekebilir ama varsayıyoruz
        storage_path = f"notes/{file_name}"
        
        result = supabase.storage.from_("voice_notes").upload(
            path=storage_path,
            file=file_content,
            file_options={"content-type": f"audio/{file_extension}"}
        )
        
        # 4. Public URL al
        public_url = supabase.storage.from_("voice_notes").get_public_url(storage_path)
        
        return {"url": public_url}
        
    except Exception as e:
        print(f"Ses Yükleme Hatası: {e}")
        # Hata mesajını daha açıklayıcı yap (Örn: Bucket yoksa veya yetki hatasıysa)
        error_detail = f"Ses yükleme hatası: {str(e)}. Lütfen Supabase'de 'voice_notes' adında bir Public Bucket oluşturduğunuzdan emin olun."
        raise HTTPException(status_code=500, detail=error_detail)
