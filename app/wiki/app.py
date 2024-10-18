from database_connection import MongoDBAtlas 
from fastapi import FastAPI, Response               # FastAPI
from fastapi.encoders import jsonable_encoder
# from fastapi.middleware.cors import CORSMiddleware  # CORS, permitir origenes como swagger.io
# from typing import Union, List                            # typing, anotacionesiones de tipos
# from pydantic import BaseModel, Field                      # pydantic, comprobaciones de tipos en runtime; tipos complejos
from Wiki import Wiki

# Helper function to convert MongoDB documents to JSON-serializable format
def serialize_document(doc):
    return {
        **doc,
        "_id": str(doc["_id"]) if "_id" in doc else None,  # Convert ObjectId to string
    }

# Initializing database
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Wikis")

api = FastAPI()

path = "/api/v1/"

@api.get(path + "wikis")                            
def get_wikis():                                   
    wikis = collection.find()
    serialized_wikis = [serialize_document(wiki) for wiki in wikis]
    return serialized_wikis

@api.post(path + "wikis")
def create_wiki(wiki: Wiki, status_code=201):
    encoded_wiki = jsonable_encoder(wiki)
    collection.insert_one(encoded_wiki)
    return wiki
