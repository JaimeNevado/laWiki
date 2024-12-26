from typing import Optional
from fastapi import HTTPException, Header, status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from environs import Env
from datetime import datetime


class Authentication:
    def __init__(self):
        env = Env()
        env.read_env()
        self.client_id = env("GOOGLE_CLIENT_ID")

    def verify_token(self, authorization: Optional[str] = Header(None)):
        token = None
        if authorization is None or not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing or malformed",
            )
        token = authorization.split(" ")[1]  # Extract the token from the header
        if token == "null" or token is None or token == "":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is missing",
            )
        try:
            id_info = id_token.verify_oauth2_token(
                token, google_requests.Request(), self.client_id
            )
            if id_info["exp"] < datetime.now().timestamp():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token is expired",
                )
            return id_info
        except:
            return None
