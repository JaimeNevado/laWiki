from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
from database_connection import MongoDBAtlas 
app = FastAPI()
db = MongoDBAtlas()
db.connect()
articles_collection = db.get_collection("Articles")

class Article(BaseModel):
    title: str
    content: str
    wiki_id: str  # Reference to the wiki this article belongs to

@app.post("/articles/")
async def create_article(article: Article):
    if not ObjectId.is_valid(article.wiki_id):
        raise HTTPException(status_code=400, detail="Invalid wiki_id")
    
    new_article = {
        "title": article.title,
        "content": article.content,
        "wiki_id": article.wiki_id
    }
    
    result = articles_collection.insert_one(new_article)
    new_article["_id"] = str(result.inserted_id)
    
    return {"message": "Article created"}