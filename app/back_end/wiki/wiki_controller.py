from fastapi import (
    FastAPI,
    File,
    Form,
    UploadFile,
    Depends,
    HTTPException,
    Request,
    Query,
)
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
from image_upload import ImageUploader
from authentication import Authentication

from pydantic import BaseModel

sys.path.append(os.path.abspath("../articles"))
from articles import Article
from environs import Env

env = Env()
env.read_env()
ARTICLE_URL = env("ARTICLE_URL")
USERS_URL = env("USERS_URL")
ORIGINS = env.list("ORIGINS_URL")
print("Article URL: ", ARTICLE_URL)
print("Allowed Origins: ", ORIGINS)

# Initializing database
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Wikis")

# initializing image uploader
image_uploader = ImageUploader()

# Initializing authentication
auth = Authentication()

api = FastAPI()


class WikiEntry(BaseModel):
    content: str


api.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
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
        query = {"author": {"$regex": f".*{author}.*", "$options": "i"}}
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
def create_wiki(
    wiki: Wiki, user_info: dict = Depends(auth.verify_token), status_code=201
):
    wiki_dict = wiki.dict()
    result = collection.insert_one(wiki_dict)

    response_msg = {}
    response_msg["msg"] = "Wiki was created successfully"
    response_msg["inserted_id"] = f"{result.inserted_id}"
    return response_msg


# Edit wiki
@api.put(path + "wikis/{item_id}")
def update(item_id: str, wiki: Wiki, user_info: dict = Depends(auth.verify_token)):
    wiki_updated = collection.find_one_and_update(
        {"_id": ObjectId(item_id)}, {"$set": dict(wiki)}
    )
    wiki_updated = serialize_document(wiki_updated)
    response_msg = {}
    response_msg["msg"] = "Wiki was updated successfully"
    response_msg["inserted_id"] = f"{wiki_updated.get('_id')}"
    return response_msg


# Removes wiki from database
@api.delete(path + "wikis/{item_id}")
async def delete(
    item_id: str, user_info: dict = Depends(auth.verify_token), status_code=204
):
    # controll user level
    print("Delete wiki, user info: ", user_info)
    user_id = user_info.get("sub")
    client = AsyncClient()
    response = await client.get(f"{USERS_URL}{path}users/{user_id}")
    response.raise_for_status()
    user = response.json()
    if user.get("level") != "admin":
        raise HTTPException(status_code=403, detail="User is not an admin")

    collection.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Wiki was deleted successfully"}


# Create new article for the given wiki
@api.post(path + "wikis/{wiki_id}/articles/")
async def create_article_for_wiki(
    wiki_id: str, article: Article, user_info: dict = Depends(auth.verify_token)
):
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


@api.post(path_v2 + "wikis")
async def create_wiki2(
    title: str = Form(..., alias="name"),
    content: str = Form(..., alias="description"),
    author: str = Form(..., alias="author"),
    logo: UploadFile = File(None, alias="logo"),
    bg_image: UploadFile = File(None, alias="bg_image"),
    user_info: dict = Depends(auth.verify_token),
    status_code=201,
):
    wiki = Wiki(name=title, description=content, author=author)
    if logo is not None:
        logo_url = await image_uploader.upload_image_from_form(logo)
        wiki.logo = logo_url

    if bg_image is not None:
        bg_image_url = await image_uploader.upload_image_from_form(bg_image)
        wiki.bg_image = bg_image_url

    result = collection.insert_one(wiki.dict())
    response_msg = {}
    response_msg["msg"] = "Wiki was created successfully"
    response_msg["inserted_id"] = f"{result.inserted_id}"
    return response_msg


@api.put(path_v2 + "wikis/{item_id}")
async def update_wiki2(
    item_id: str,
    title: str = Form(..., alias="name"),
    content: str = Form(..., alias="description"),
    author: str = Form(..., alias="author"),
    logo: UploadFile = File(None, alias="logo"),
    bg_image: UploadFile = File(None, alias="bg_image"),
    user_info: dict = Depends(auth.verify_token),
):
    wiki = {
        "name": title,
        "description": content,
        "author": author,
    }
    # wiki = Wiki(name=title, description=content, author=author)
    if logo is not None:
        logo_url = await image_uploader.upload_image_from_form(logo)
        wiki["logo"] = logo_url

    if bg_image is not None:
        bg_image_url = await image_uploader.upload_image_from_form(bg_image)
        wiki["bg_image"] = bg_image_url

    wiki_updated = collection.find_one_and_update(
        {"_id": ObjectId(item_id)}, {"$set": wiki}
    )
    wiki_updated = serialize_document(wiki_updated)
    response_msg = {}
    response_msg["msg"] = "Wiki was updated successfully"
    response_msg["inserted_id"] = f"{wiki_updated.get('_id')}"
    return response_msg
