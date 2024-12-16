from fastapi import FastAPI, Request
from bson import ObjectId
from typing import Union
from httpx import AsyncClient
from wiki import Wiki
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

import sys
import os

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document
from image_upload import ImageUploader

sys.path.append(os.path.abspath("../articles"))
from articles import Article


ARTICLE_URL = "http://127.0.0.1:13001"
ARTICLE_URL_DOCKER = "http://articles-1"


# Initializing database
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Wikis")

# initializing image uploader
image_uploader = ImageUploader()

api = FastAPI()

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
path_v2 = "/api/v2/"


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
    if wiki is not None:
        return serialize_document(wiki)
    return {}


# Create new Wiki
@api.post(path + "wikis")
def create_wiki(wiki: Wiki, status_code=201):
    wiki_dict = wiki.dict()
    result = collection.insert_one(wiki_dict)

    response_msg = {}
    response_msg["msg"] = "Wiki was created successfully"
    response_msg["inserted_id"] = f"{result.inserted_id}"
    return response_msg


# Edit wiki
@api.put(path + "wikis/{item_id}")
def update(item_id: str, wiki: Wiki):
    wiki_updated = collection.find_one_and_update(
        {"_id": ObjectId(item_id)}, {"$set": dict(wiki)}
    )
    wiki_updated = serialize_document(wiki_updated)
    response_msg = {}
    response_msg["msg"] = "Wiki was updated successfully"
    response_msg["inserted_id"] = f"{wiki_updated.get('_id')}"
    return response_msg


@api.post(path_v2 + "wikis")
async def create_wiki_test(request: Request):
    form = await request.form()
    # print("Create wiki test form: ", form)

    wikiID = form.get("wikiID")
    name = form.get("name")
    description = form.get("description")
    author = form.get("author")
    bg_image = form.get("bg_image")
    logo = form.get("logo")

    wiki = {}
    wiki["name"] = name
    wiki["description"] = description
    wiki["author"] = author
    if bg_image is not None:
        file_content = await bg_image.read()
        upload_result = image_uploader.upload_image(
            file_content, f"{name}_bg_{datetime.now().timestamp()}"
        )
        wiki["bg_image"] = upload_result["secure_url"]
    if logo is not None:
        file_content = await logo.read()
        upload_result = image_uploader.upload_image(
            file_content, f"{name}_logo_{datetime.now().timestamp()}"
        )
        wiki["logo"] = upload_result["secure_url"]

    result = None
    if (
        wikiID is not None
        and wikiID != ""
        and wikiID != "undefined"
        and wikiID != "null"
    ):
        result = update(wikiID, Wiki(**wiki))
    else:
        result = create_wiki(Wiki(**wiki))
    return result


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
    response = await client.post(ARTICLE_URL + path + "articles", json=article_data)
    response.raise_for_status()  # Raise an error for HTTP errors

    # Assuming the article service returns a JSON list of articles
    return response.json()


# Get articles of the wiki
@api.get(path + "wikis/{wiki_id}/articles")
async def get_articles_for_wiki(wiki_id: str):
    client = AsyncClient()
    url = f"{ARTICLE_URL}{path}articles"
    params = "?wikiID={}".format(wiki_id)
    response = await client.get(url + params)
    return response.json()


# Get articles of the wiki
@api.get(path + "wikis/{wiki_id}/previewArticles")
async def get_articles_for_wiki(wiki_id: str, num_of_article: int = 10, random=True):
    client = AsyncClient()
    url = f"{ARTICLE_URL}{path}articles/preview"
    params = "?wikiID={}&num_of_article={}&random={}".format(
        wiki_id, num_of_article, random
    )
    response = await client.get(url + params)
    return response.json()
