# I followed best practices from the slides
# plural names
# plural_name_collection
# post messages: object name + was created successfully
# delete messages: object name + was deleted successfully
from fastapi import FastAPI
from database_connection import MongoDBAtlas
from articles import Article
from schemas import list_serial
from bson import ObjectId


db = MongoDBAtlas()
db.connect()
articles_collection = db.get_collection("Articles")

router = FastAPI()

path = "/api/v1/"
# GET Request Method
@router.get(path + "articles")
async def get_articles():
    articles = list_serial(articles_collection.find())
    return articles

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