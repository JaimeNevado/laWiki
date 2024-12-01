from fastapi import Depends, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = "TU_CLIENT_ID_AQUÍ"
GOOGLE_CLIENT_SECRET = "TU_CLIENT_SECRET_AQUÍ"

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="https://accounts.google.com/o/oauth2/auth",
    tokenUrl="https://oauth2.googleapis.com/token"
)

def verify_google_token(token: str):
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        return id_info
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
