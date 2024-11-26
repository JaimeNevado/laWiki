from fastapi import FastAPI
from bson import ObjectId
from typing import Union
from httpx import AsyncClient
from wiki import Wiki
from fastapi.middleware.cors import CORSMiddleware

import sys
import os

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document

sys.path.append(os.path.abspath("../articles"))
from articles import Article


ARTICLE_URL = "http://127.0.0.1:13001"
ARTICLE_URL_DOCKER = "http://articles-1"


# Initializing database
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Wikis")

api = FastAPI()

origins = [
    "http://localhost:3000",
]
api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

path = "/api/v1/"


# sirve tanto para wikis como para wiki
@api.get(path + "wikis")
def get_wikis(author: Union[str, None] = None, order_type: int = 1):
    query = None
    if author is not None:
        query = {"author": author}
    wikis = collection.find(query).sort("name", order_type)
    serialized_wikis = [serialize_document(wiki) for wiki in wikis]
    return serialized_wikis


# Get wkki by ID
@api.get(path + "wikis/{wiki_id}")
async def get_wiki_by_id(wiki_id: str):
    wiki = collection.find_one({"_id": ObjectId(wiki_id)})
    serialized_wiki = serialize_document(wiki)
    return serialized_wiki


# Create new Wiki
@api.post(path + "wikis")
def create_wiki(wiki: Wiki, status_code=201):
    collection.insert_one(dict(wiki))
    return {"message": "Wiki was created successfully"}


# Edit wiki
@api.put(path + "wikis/{item_id}")
def update(item_id: str, wiki: Wiki):
    wiki_updated = collection.find_one_and_update(
        {"_id": ObjectId(item_id)}, {"$set": dict(wiki)}
    )
    return {"message": "Wiki was updated successfully"}


# Removes wiki from database
@api.delete(path + "wikis/{item_id}")
def delete(item_id: str):
    collection.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Wiki was deleted successfully"}


# Create new article for the given wiki
@api.post(path + "wikis/{wiki_id}/articles/")
async def create_article_for_wiki(wiki_id: str, article: Article):
    # Using an asynchronous HTTP client to call the article microservice
    client = AsyncClient()
    article_data = dict(article)
    article_data["wikiID"] = wiki_id

    # Send a POST request to the articles microservice to create the article
    response = await client.post(
        ARTICLE_URL_DOCKER + path + "articles", json=article_data
    )
    response.raise_for_status()  # Raise an error for HTTP errors

    # Assuming the article service returns a JSON list of articles
    return response.json()


# Get articles of the wiki
@api.get(path + "wikis/{wiki_id}/articles")
async def get_articles_for_wiki(wiki_id: str):
    client = AsyncClient()
    url = f"{ARTICLE_URL_DOCKER}{path}articles"
    params = "?wikiID={}".format(wiki_id)
    response = await client.get(url + params)
    return response.json()


# Get articles of the wiki
@api.get(path + "wikis/{wiki_id}/previewArticles")
async def get_articles_for_wiki(wiki_id: str, num_of_article: int = 10):
    client = AsyncClient()
    url = f"{ARTICLE_URL_DOCKER}{path}articles/preview"
    params = "?wikiID={}&num_of_article={}".format(wiki_id, num_of_article)
    response = await client.get(url + params)
    return response.json()
