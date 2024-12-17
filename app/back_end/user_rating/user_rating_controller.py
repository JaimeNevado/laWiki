from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from typing import Union
from httpx import AsyncClient
from datetime import datetime, timezone
from pydantic import BaseModel
import sys
import os

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document


ARTICLE_URL = "http://127.0.0.1:13001"
ARTICLE_URL_DOCKER = "http://articles-1"

# Inicialización de la base de datos
db = MongoDBAtlas()
db.connect()
ratings_collection = db.get_collection("Ratings")

api = FastAPI()

# Configuración CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

path = "/api/v1/"


# Modelo para las valoraciones
class Rating(BaseModel):
    user_id: str
    rating: float


# Obtener todas las valoraciones de un usuario específico
@api.get(path + "ratings/{user_id}")
def get_ratings_by_user(user_id: str):
    query = {"user_id": user_id}
    ratings = ratings_collection.find(query).sort("date", -1)
    serialized_ratings = [serialize_document(rating) for rating in ratings]
    if not serialized_ratings:
        raise HTTPException(status_code=404, detail="No se encontraron valoraciones para este usuario")
    return serialized_ratings


# Guardar una nueva valoración para un usuario
@api.post(path + "ratings", status_code=201)
def save_rating(rating: Rating):
    if rating.rating < 0 or rating.rating > 5:
        raise HTTPException(status_code=400, detail="La valoración debe estar entre 0 y 5.")
    try:
        rating_data = rating.dict()
        rating_data["date"] = datetime.now(timezone.utc)
        ratings_collection.insert_one(rating_data)
        return {"message": "Valoración guardada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al guardar la valoración")


# Eliminar todas las valoraciones de un usuario específico
@api.delete(path + "ratings/{user_id}")
def delete_ratings_by_user(user_id: str):
    result = ratings_collection.delete_many({"user_id": user_id})
    return {"message": f"Se eliminaron {result.deleted_count} valoraciones del usuario {user_id}"}
