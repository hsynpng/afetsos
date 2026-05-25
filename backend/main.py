from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.api.reports import router as reports_router
from app.api.teams import router as teams_router
from app.api.upload import router as upload_router

app = FastAPI(title="AFETSOS API", description="AI Destekli Afet İletişim Platformu API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları ekle
app.include_router(reports_router)
app.include_router(teams_router)
app.include_router(upload_router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "AFETSOS API servisleri çalışıyor.",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
