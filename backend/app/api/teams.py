from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.core.supabase_client import supabase

router = APIRouter(prefix="/teams", tags=["Teams"])

class TeamCreate(BaseModel):
    name: str
    members: int
    expertise: str
    leader_name: Optional[str] = None

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    members: Optional[int] = None
    expertise: Optional[str] = None
    leader_name: Optional[str] = None

@router.get("/")
async def get_teams():
    result = supabase.table("teams").select("*").order("name").execute()
    return result.data

@router.post("/")
async def create_team(team: TeamCreate):
    try:
        result = supabase.table("teams").insert(team.dict()).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{team_id}")
async def update_team(team_id: str, team: TeamUpdate):
    try:
        result = supabase.table("teams").update(team.dict(exclude_unset=True)).eq("id", team_id).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{team_id}")
async def delete_team(team_id: str):
    try:
        supabase.table("teams").delete().eq("id", team_id).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
