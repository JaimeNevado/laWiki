# I followed best practices from the slides
# plural names
# plural_name_collection
# post messages: object name + was created successfully
# delete messages: object name + was deleted successfully
from fastapi import FastAPI

from articles import Article
from schemas import list_serial
from bson import ObjectId
from typing import Union
from httpx import AsyncClient
import sys
import os
sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas 



# Helper function to convert MongoDB documents to JSON-serializable format
def serialize_document(doc):
    return {
        **doc,
        "_id": str(doc["_id"]) if "_id" in doc else None,  # Convert ObjectId to string
    }

COMMENTS_URL = "http://127.0.0.1:13002"
COMMENTS_URL_DOCKER = "http://comments-1"


db = MongoDBAtlas()
db.connect()
articles_collection = db.get_collection("Articles")

router = FastAPI()

path = "/api/v1/"
# GET Request Method
@router.get(path + "articles")
async def get_articles_by_wikiID(wikiID: Union[str, None] = None, order_type: int = 1):
    query = None
    if wikiID is not None:
        query = {"wikiID": wikiID}
    articles = articles_collection.find(query).sort("wikiID", order_type)
    serialized_articles = [serialize_document(article) for article in articles]
    return serialized_articles

# POST Request Method
@router.post(path + "articles")
async def post_article(article: Article):
    articles_collection.insert_one(dict(article))
    return {"message": "Article was created successfully"}

# PUT Request Method
@router.put(path + "articles/{id}")
async def update(id: str, article: Article):
    articles_collection.find_one_and_update({"_id" : ObjectId(id)}, {"$set" : dict(article)})
    return {"message": "Article was  updated successfully"}

# Delete Request Method
@router.delete(path + "articles/{id}")
async def delete(id: str):
    articles_collection.find_one_and_delete({"_id" : ObjectId(id)})
    return {"message": "Article was deleted successfully"}

# Show commets that belongs to this article
@router.get(path + "articles/{article_id}/comments")
async def get_comments_of_given_article(article_id: str, date_order: int = 1):
    # Using an asynchronous HTTP client to call the article microservice
    client = AsyncClient()

    params ="?article_id={}&date_order={}".format(article_id, date_order)
    # params = "?article_id={article_id}&date_order={date_order}"
    # Send a POST request to the articles microservice to create the article
    response = await client.get(COMMENTS_URL_DOCKER + path + "comments" + params)
    response.raise_for_status()  # Raise an error for HTTP errors

    # Assuming the article service returns a JSON list of articles
    return response.json()
    # return {"params": params}