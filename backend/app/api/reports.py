from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_service import ai_service
from app.core.supabase_client import supabase

router = APIRouter(prefix="/reports", tags=["Reports"])

class ReportCreate(BaseModel):
    message: str
    latitude: float
    longitude: float
    user_id: Optional[str] = None
    voice_url: Optional[str] = None

@router.post("/")
async def create_report(report: ReportCreate):
    # 1. AI ile mesajı analiz et (Opsiyonel - Hata alsa da devam et)
    try:
        analysis = await ai_service.analyze_emergency_message(report.message, report.voice_url)
    except Exception as ai_err:
        print(f"AI Analiz Hatası: {ai_err}")
        analysis = {
            "urgency": "Medium",
            "need_type": "Genel Yardım",
            "victim_count": 1,
            "health_status": "Bilinmiyor",
            "floor_number": None,
            "infrastructure_damage": None,
            "location_context": None
        }
    
    # Eğer mesaj boşsa ve sesli nottan transcription geldiyse onu kullan
    final_message = report.message
    if not final_message and "transcription" in analysis:
        final_message = analysis["transcription"]

    # Acil durum seviyesini doğrula (Veritabanı ENUM hatasını önlemek için)
    valid_urgencies = ["Low", "Medium", "High", "Critical"]
    ai_urgency = analysis.get("urgency", "Medium")
    if ai_urgency not in valid_urgencies:
        ai_urgency = "Medium"

    # 2. Veri Hazırlama
    report_data = {
        "message": final_message,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "user_id": report.user_id,
        "voice_url": report.voice_url,
        "urgency_level": ai_urgency,
        "need_type": analysis.get("need_type", "Genel Yardım"),
        "status": "Pending"
    }

    try:
        # Detaylı verileri ekle
        full_data = {**report_data, 
            "victim_count": int(analysis.get("victim_count", 1)),
            "health_status": analysis.get("health_status"),
            "floor_number": analysis.get("floor_number"),
            "infrastructure_damage": analysis.get("infrastructure_damage")
        }
        
        result = supabase.table("reports").insert(full_data).execute()
        
        if result.data and len(result.data) > 0:
            return {
                "status": "success",
                "message": "Rapor detaylı olarak kaydedildi.",
                "id": str(result.data[0].get("id", "no_id")),
                "data": result.data[0]
            }
        else:
            # Data boş dönse bile başarılı sayabiliriz (insert hatası olsaydı exception fırlardı)
            return {
                "status": "success",
                "message": "Rapor kaydedildi (ID alınamadı).",
                "id": "unknown_id"
            }
        
    except Exception as db_error:
        print(f"Veritabanı Detaylı Kayıt Hatası: {db_error}")
        # Detaylı verilerle başarısız olursa temel verilerle dene
        try:
            result = supabase.table("reports").insert(report_data).execute()
            if result.data and len(result.data) > 0:
                return {
                    "status": "partial_success",
                    "message": "Rapor temel verilerle kaydedildi.",
                    "id": str(result.data[0].get("id", "no_id")),
                    "data": result.data[0]
                }
            else:
                return {
                    "status": "success",
                    "message": "Rapor temel verilerle kaydedildi (ID yok).",
                    "id": "unknown_id"
                }
        except Exception as final_error:
            raise HTTPException(status_code=500, detail=f"Kritik Veritabanı Hatası: {str(final_error)}")

@router.get("/")
async def get_reports():
    result = supabase.table("reports").select("*").order("created_at", desc=True).execute()
    return result.data

@router.patch("/{report_id}")
async def update_report(report_id: str, update_data: dict):
    try:
        # Eğer yeni bir ekip atanıyorsa
        if "new_team" in update_data:
            team_name = update_data.pop("new_team")
            current = supabase.table("reports").select("assigned_teams").eq("id", report_id).single().execute()
            current_teams = current.data.get("assigned_teams") or []
            if team_name not in current_teams:
                current_teams.append(team_name)
            update_data["assigned_teams"] = current_teams
            update_data["status"] = "In Progress"
        
        # Eğer bir ekip görevden alınıyorsa
        elif "remove_team" in update_data:
            team_name = update_data.pop("remove_team")
            current = supabase.table("reports").select("assigned_teams").eq("id", report_id).single().execute()
            current_teams = current.data.get("assigned_teams") or []
            if team_name in current_teams:
                current_teams.remove(team_name)
            update_data["assigned_teams"] = current_teams
            # Eğer hiç ekip kalmadıysa statüyü tekrar Pending yapabiliriz (Opsiyonel)
            if not current_teams:
                update_data["status"] = "Pending"

        # Eğer vaka tamamen kapatılıyorsa (Çözüldü)
        elif update_data.get("status") == "Resolved":
            update_data["assigned_teams"] = [] # Tüm ekipleri boşa çıkar
            update_data["status"] = "Resolved"

        result = supabase.table("reports").update(update_data).eq("id", report_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Rapor bulunamadı.")
        return {"status": "success", "data": result.data[0]}
    except Exception as e:
        print(f"Update error: {e}")
        raise HTTPException(status_code=500, detail=f"Güncelleme Hatası: {str(e)}")

@router.delete("/{report_id}")
async def delete_report(report_id: str):
    try:
        result = supabase.table("reports").delete().eq("id", report_id).execute()
        return {"status": "success", "message": "Rapor başarıyla silindi."}
    except Exception as e:
        print(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail=f"Silme Hatası: {str(e)}")
