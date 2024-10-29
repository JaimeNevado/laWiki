from fastapi import FastAPI
from database_connection import MongoDBAtlas
from articles import Article
from schemas import list_serial
from bson import ObjectId


db = MongoDBAtlas()
db.connect()
collection_name = db.get_collection("Articles")

router = FastAPI()

# GET Request Method
@router.get("/")
async def get_articles():
    articles = list_serial(collection_name.find())
    return articles

# POST Request Method
@router.post("/")
async def post_article(article: Article):
    collection_name.insert_one(dict(article))

# PUT Request Method
@router.put("/{id}")
async def put_article(id: str, article: Article):
    collection_name.find_one_and_update({"_id" : ObjectId(id)}, {"$set" : dict(article)})


# Delete Request Method
@router.delete("/{id}")
async def delete_article(id: str):
    collection_name.find_one_and_delete({"_id" : ObjectId(id)})
    