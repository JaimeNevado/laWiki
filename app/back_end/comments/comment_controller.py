from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from typing import Union
from httpx import AsyncClient
from comments import Comment
import sys
import os

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document


ARTICLE_URL = "http://127.0.0.1:13001"
ARTICLE_URL_DOCKER = "http://articles-1"


# Initializing database
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Comments")

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


# Get all comments of the system, allows filter comments by author or title
@api.get(path + "comments")
def get_comments(
    author: Union[str, None] = None,
    author_order: Union[int, None] = None,
    title: Union[str, None] = None,
    title_order: Union[int, None] = None,
    date_order: Union[int, None] = None,
    article_id: Union[str, None] = None,
):

    query = {}
    if author is not None:
        query["author_id"] = author
    if title is not None:
        query["title"] = title
    if article_id is not None:
        query["article_id"] = article_id
    if len(query) == 0:
        query = None

    sort_order = {}
    if date_order is not None:
        sort_order["date"] = date_order
    if author_order is not None:
        sort_order["author_id"] = author_order
    if title_order is not None:
        sort_order["title"] = title_order
    if len(sort_order) == 0:
        sort_order["date"] = 1

    comments = collection.find(query).sort(sort_order)
    serialized_comments = [serialize_document(comment) for comment in comments]
    return serialized_comments


# get comment by id
@api.get(path + "commments/{comment_id}")
async def get_comment_by_id(comment_id: str):
    comment = collection.find_one({"_id": ObjectId(comment_id)})
    serialized_comment = serialize_document(comment)
    return serialized_comment


# add new comment
@api.post(path + "comments")
def create_comment(comment: Comment, status_code=201):
    collection.insert_one(dict(comment))
    return {"message": "Comment was created successfully"}


@api.delete(path + "comments/{comment_id}")
def delete(comment_id: str):
    collection.delete_one({"_id": ObjectId(comment_id)})
    return {"message": "Comment was deleted successfully"}


# Edit comment
@api.put(path + "comments/{comment_id}")
def update(comment_id: str, comment: Comment):
    comment_updated = collection.find_one_and_update(
        {"_id": ObjectId(comment_id)}, {"$set": dict(comment)}
    )
    return {"message": "Comment was updated successfully"}


# used to show all comments that belongs to the same article
@api.get(path + "{article_id}/comments/")
def get_comments_of_given_article(article_id: str, order_type: int = 1):
    query = {"article_id": article_id}
    comments = collection.find(query).sort("date", order_type)
    serialized_comments = [serialize_document(comment) for comment in comments]
    return serialized_comments


# Get Article that is associated with given comment
@api.get(path + "comments/{comment_id}/article")
async def get_article_of_the_comment(comment_id: str):
    comment = await get_comment_by_id(comment_id)
    article_id = dict(comment).get("article_id")

    client = AsyncClient()

    response = await client.get(ARTICLE_URL + path + "articles/" + article_id)
    response.raise_for_status()  # Raise an error for HTTP errors

    return response.json()


# Get Wiki that is associated with given comment
@api.get(path + "comments/{comment_id}/wiki")
async def get_wiki_of_the_comment(comment_id: str):
    article = await get_article_of_the_comment(comment_id)
    article_id = dict(article).get("_id")

    client = AsyncClient()
    response = await client.get(ARTICLE_URL + path + "articles/" + article_id + "/wiki")
    response.raise_for_status()

    return response.json()
