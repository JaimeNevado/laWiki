from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from articles import Article
from bson import ObjectId
from typing import Union
from httpx import AsyncClient
from datetime import datetime, timezone
import sys
import os

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document, isostr_to_date

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
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
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
async def get_articles_by_wikiID(
    wikiID: Union[str, None] = None, name: Union[str, None] = None, order_type: int = 1
):
    query = {}
    if wikiID is not None:
        query["wikiID"] = wikiID
    if name is not None:
        query["name"] = {"$regex": name, "$options": "i"}

    if not query:
        query = None

    if order_type is None:
        order_type = 1

    articles = collection.find(query).sort("wikiID", order_type)
    serialized_articles = [serialize_document(article) for article in articles]
    return serialized_articles


# GET Request Method
@router.get(path + "articles/preview")
async def get_articles_by_wikiID(
    wikiID: Union[str, None] = None,
    name: Union[str, None] = None,
    random: bool = False,
    num_of_article: int = 10,
    wiki_name: Union[str, None] = None,
    author: Union[str, None] = None,
    date_from: datetime = None,  # datetime(1970, 1, 1, tzinfo=timezone.utc),
    date_to: datetime = None,  # datetime.now(timezone.utc),
):
    query = []
    if wikiID is not None:
        query.append({"$match": {"wikiID": wikiID}})
    if random:
        query.append({"$sample": {"size": num_of_article}})
    if name:
        query.append({"$match": {"name": {"$regex": name, "$options": "i"}}})
    if author:
        query.append({"$match": {"author": {"$regex": author, "$options": "i"}}})

    if date_from and date_to:
        query.append({"$match": {"date": {"$gte": date_from, "$lte": date_to}}})
    elif date_from and not date_to:
        query.append({"$match": {"date": {"$gte": date_from}}})
    elif not date_from and date_to:
        query.append({"$match": {"date": {"$lte": date_to}}})
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
    # print("from: ", date_from, " to: ", date_to)
    articles = collection.aggregate(query)
    serialized_articles = [serialize_document(article) for article in articles]
    return serialized_articles


# Get 1 article by id
@router.get(path + "articles/{article_id}")
async def get_article_by_id(article_id: str):
    article = collection.find_one({"_id": ObjectId(article_id)})
    serialized_article = serialize_document(article)  # No error control so far
    aritcle_date_parsed = isostr_to_date(serialized_article)
    return aritcle_date_parsed


# POST Request Method
@router.post(path + "articles")
async def post_article(article: Article):
    article_dict = article.dict()
    article_dict["date"] = datetime.now(timezone.utc)
    result = collection.insert_one(article_dict)
    response_msg = {}
    response_msg["msg"] = "Article was created successfully"
    response_msg["inserted_id"] = f"{result.inserted_id}"
    return response_msg


# PUT Request Method
@router.put(path + "articles/{id}")
async def update(id: str, article: Article):
    collection.find_one_and_update({"_id": ObjectId(id)}, {"$set": article.to_dict()})
    return {"message": "Article was  updated successfully"}


# Delete Request Method
@router.delete(path + "articles/{id}")
async def delete(id: str):
    collection.find_one_and_delete({"_id": ObjectId(id)})
    return {"message": "Article was deleted successfully"}


@router.delete(path + "articles/wiki/{id}")
async def delete_articles_of_given_wiki(id: str):
    result = collection.delete_many({"wikiID": id})
    msg = f"Was removed {result.deleted_count} articles"
    return {"msg": msg}


# Show commets that belongs to this article
@router.get(path + "articles/{article_id}/comments")
async def get_comments_of_given_article(article_id: str, date_order: int = 1):
    client = AsyncClient()

    params = "?article_id={}&date_order={}".format(article_id, date_order)

    response = await client.get(COMMENTS_URL + path + "comments" + params)
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
    response = await client.post(COMMENTS_URL + path + "comments", json=comment_data)
    response.raise_for_status()  # Raise an error for HTTP errors

    # Assuming the article service returns a JSON list of articles
    return response.json()


# Get wiki of the given article
@router.get(path + "articles/{article_id}/wiki")
async def get_wiki_of_the_article(article_id: str):
    client = AsyncClient()
    article = await get_article_by_id(article_id)
    wiki_id = dict(article).get("wikiID")

    response = await client.get(WIKI_URL + path + "wikis/" + wiki_id)
    response.raise_for_status()

    return response.json()
