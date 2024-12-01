from fastapi import FastAPI, HTTPException, Request
from google.oauth2 import id_token
from google.auth.transport import requests

app = FastAPI()

GOOGLE_CLIENT_ID = "1006264475075-acpgmbih4dihuli7pj5fa0vfkc672fa3.apps.googleusercontent.com"  # Reemplaza con tu CLIENT_ID de Google

@app.post("/auth/login")
async def login(request: Request):
    body = await request.json()
    token = body.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Falta el token")
    
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        user_info = {
            "name": id_info.get("name"),
            "email": id_info.get("email"),
            "picture": id_info.get("picture"),
        }
        return {"message": "Inicio de sesión exitoso", "user": user_info}
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
