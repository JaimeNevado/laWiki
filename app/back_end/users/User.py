from pydantic import BaseModel, EmailStr, condecimal
from typing import Literal #Para que solo acepte las opciones de este literal
from database_connection import MongoDBAtlas

class User(BaseModel):
    name: str
    gmail: EmailStr
    googleID: str
    rating: float
    nComentarios: int
    level: Literal['redactor', 'admin']
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "usuarioPrueba",
                    "gmail": "usuarioprueba@gmail.com",
                    "googleID": "1234",
                    "rating": 4.5,
                    "level": "redactor",
                    "nComentarios": 2,
                }
            ]
        }
    }

# Ejemplo de uso