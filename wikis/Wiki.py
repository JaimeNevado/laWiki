from pydantic import BaseModel
from typing import Union
from fastapi import FastAPI, Response
from bson import ObjectId  # Para trabajar con ObjectId de MongoDB
from MongoDBAtlas import db

# Conexión a la colección en MongoDB
wiki_collection = db['Wikis']

# Definir el modelo de datos con Pydantic
class Wiki(BaseModel):
    name: str
    author: str
    description: Union[str, None] = None

api = FastAPI()

path = "/api/v1/"

# POST: Crear un nuevo documento Wiki
@api.post(path + "create", status_code=201)
def create(wiki: Wiki):
    # Convertir el modelo Pydantic a diccionario antes de insertarlo
    wiki_data = wiki.dict()
    # Insertar el documento en MongoDB
    result = wiki_collection.insert_one(wiki_data)
    # Devolver el ID del documento insertado
    return {"inserted_id": str(result.inserted_id)}

# GET: Obtener todos los documentos de la colección Wikis
@api.get(path + "wikis")
def get_wikis():
    # Obtener todos los documentos de la colección
    documentos = list(wiki_collection.find())


    
    # Devolver los documentos como una lista JSON
    return documentos