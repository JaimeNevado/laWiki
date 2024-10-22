from http.client import HTTPException
import json
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
    documentos =  list(wiki_collection.find())
    for documento in documentos:
        documento["_id"] = str(documento["_id"])
    json_documentos = json.dumps(documentos)

    # Devolver los documentos como una lista JSON
    return documentos

#Elimina uno de las wikis
@api.delete(path + "wikis/{item_id}")
async def delete(item_id: str):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid item ID")
    
    delete_result =  wiki_collection.delete_one({"_id" : ObjectId(item_id)})

    return {"message": "Item deleted successfully"}