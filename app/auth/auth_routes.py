from fastapi import APIRouter, Depends
from .oauth2 import verify_google_token, oauth2_scheme

router = APIRouter()

@router.get("/login")
async def login(token: str = Depends(oauth2_scheme)):
    user_info = verify_google_token(token)
    return {"message": "Inicio de sesión exitoso", "user": user_info}
