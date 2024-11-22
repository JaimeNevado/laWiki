from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from articles import Article
from bson import ObjectId
from typing import Union
from httpx import AsyncClient
import sys
import os

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from serializer import serialize_document

sys.path.append(os.path.abspath("../comments"))
from comments import Comment


COMMENTS_URL = "http://127.0.0.1:13002"
COMMENTS_URL_DOCKER = "http://comments-1"
WIKI_URL = "http://127.0.0.1:13000"
WIKI_URL_DOCKER = "http://wikis-1"

db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Articles")

router = FastAPI()

origins = [
    "http://127.0.0.1:3000",
]
router.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

path = "/api/v1/"


# GET Request Method
@router.get(path + "articles")
async def get_articles_by_wikiID(wikiID: Union[str, None] = None, order_type: int = 1):
    query = None
    if wikiID is not None:
        query = {"wikiID": wikiID}
    articles = collection.find(query).sort("wikiID", order_type)
    serialized_articles = [serialize_document(article) for article in articles]
    return serialized_articles


# GET Request Method
@router.get(path + "articles/preview")
async def get_articles_by_wikiID(
    wikiID: Union[str, None] = None, num_of_article: int = 10
):
    query = []
    if wikiID is not None:
        query.append({"$match": {"wikiID": wikiID}})
    query.append({"$sample": {"size": num_of_article}})
    query.append(
        {
            "$project": {
                "_id": 1,
                "name": 1,
                "author": 1,
                "images": {"$arrayElemAt": ["$images", 0]},
                "short_text": 1,
            }
        }
    )
    articles = collection.aggregate(query)
    serialized_articles = [serialize_document(article) for article in articles]
    return serialized_articles


# Get 1 article by id
@router.get(path + "articles/{article_id}")
async def get_article_by_id(article_id: str):
    article = collection.find_one({"_id": ObjectId(article_id)})
    serialized_article = serialize_document(article)  # No error control so far
    return serialized_article


# POST Request Method
@router.post(path + "articles")
async def post_article(article: Article):
    collection.insert_one(dict(article))
    return {"message": "Article was created successfully"}


# PUT Request Method
@router.put(path + "articles/{id}")
async def update(id: str, article: Article):
    collection.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(article)})
    return {"message": "Article was  updated successfully"}


# Delete Request Method
@router.delete(path + "articles/{id}")
async def delete(id: str):
    collection.find_one_and_delete({"_id": ObjectId(id)})
    return {"message": "Article was deleted successfully"}


# Show commets that belongs to this article
@router.get(path + "articles/{article_id}/comments")
async def get_comments_of_given_article(article_id: str, date_order: int = 1):
    client = AsyncClient()

    params = "?article_id={}&date_order={}".format(article_id, date_order)

    response = await client.get(COMMENTS_URL_DOCKER + path + "comments" + params)
    response.raise_for_status()  # Raise an error for HTTP errors

    return response.json()


# Create a comment for the article
@router.post(path + "articles/{article_id}/comments")
async def create_comment_for_given_article(article_id: str, comment: Comment):
    # Using an asynchronous HTTP client to call the article microservice
    client = AsyncClient()
    comment_data = dict(comment)
    comment_data["article_id"] = article_id

    # Send a POST request to the articles microservice to create the article
    response = await client.post(
        COMMENTS_URL_DOCKER + path + "comments", json=comment_data
    )
    response.raise_for_status()  # Raise an error for HTTP errors

    # Assuming the article service returns a JSON list of articles
    return response.json()


# Get wiki of the given article
@router.get(path + "articles/{article_id}/wiki")
async def get_wiki_of_the_article(article_id: str):
    client = AsyncClient()
    article = await get_article_by_id(article_id)
    wiki_id = dict(article).get("wikiID")

    response = await client.get(WIKI_URL_DOCKER + path + "wikis/" + wiki_id)
    response.raise_for_status()

    return response.json()
