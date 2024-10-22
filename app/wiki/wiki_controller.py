from http.client import HTTPException
from database_connection import MongoDBAtlas 
from fastapi import FastAPI, Response               # FastAPI
from fastapi.encoders import jsonable_encoder
from bson import ObjectId 
# from fastapi.middleware.cors import CORSMiddleware  # CORS, permitir origenes como swagger.io
from typing import Union, List                            # typing, anotacionesiones de tipos
# from pydantic import BaseModel, Field                      # pydantic, comprobaciones de tipos en runtime; tipos complejos
from wiki import Wiki

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
def get_wikis(author: Union[str, None] = None, order_type: int = 1):
    query = None
    if author is not None:
        query = {"author" : author}                                 
    wikis = collection.find(query).sort("name",order_type)
    serialized_wikis = [serialize_document(wiki) for wiki in wikis]
    return serialized_wikis

@api.post(path + "wikis")
def create_wiki(wiki: Wiki, status_code=201):
    encoded_wiki = jsonable_encoder(wiki)
    collection.insert_one(encoded_wiki)
    return wiki

@api.delete(path + "wikis/{item_id}")
async def delete(item_id: str):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid item ID")
    
    delete_result =  collection.delete_one({"_id" : ObjectId(item_id)})

    return {"message": "Item deleted successfully"}

@api.put(path + "wikis/{item_id}")
def update(item_id: str, wiki: Wiki):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid item ID")
    #wikiSet = {k: v for k, v in wiki.dict().items()}
    wiki_updated = collection.find_one_and_update(
        {"_id" : ObjectId(item_id)},
        {"$set" : wiki.dict()},
        return_document = True
    )

    if wiki_updated is None :
        raise HTTPException(status_code=404,detail="Wiki not found")
    return serialize_document(wiki_updated)
    
