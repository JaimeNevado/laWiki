# from http.client import HTTPException
from bson import ObjectId 
from typing import Union
from comment import Comment
# from httpx import AsyncClient;
import sys
import os
sys.path.append(os.path.abspath('../articles'))
# from articles import Article
sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas 
from fastapi import FastAPI

# Helper function to convert MongoDB documents to JSON-serializable format
def serialize_document(doc):
    return {
        **doc,
        "_id": str(doc["_id"]) if "_id" in doc else None,  # Convert ObjectId to string
    }



# Initializing database
db = MongoDBAtlas()
db.connect()
comment_collection = db.get_collection("Comments")

api = FastAPI()

path = "/api/v1/"

# Get all comments of the system, allows filter comments by author or title
@api.get(path + "comments")                            
def get_comments(author: Union[str, None] = None,
                 author_order: Union[int, None] = None,
                 title: Union[str, None] = None,
                 title_order: Union[int, None] = None,
                 date_order: Union[int, None] = None,
                 article_id: Union[str, None] = None
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

    comments = comment_collection.find(query).sort(sort_order)
    serialized_comments = [serialize_document(comment) for comment in comments]
    return serialized_comments

# add new comment
@api.post(path + "comments")
def create_comment(comment: Comment, status_code=201):
    comment_collection.insert_one(dict(comment))
    return {"message": "Comment was created successfully"}

@api.delete(path + "comments/{comment_id}")
def delete(comment_id: str):
   comment_collection.delete_one({"_id" : ObjectId(comment_id)})
   return {"message": "Comment was deleted successfully"}

# Edit comment
@api.put(path + "comments/{comment_id}")
def update(comment_id: str, comment: Comment):
    comment_updated = comment_collection.find_one_and_update( {"_id" : ObjectId(comment_id)},{"$set" : dict(comment)})
    return {"message": "Comment was updated successfully"}



# used to show all comments that belongs to the same article
@api.get(path + "{article_id}/comments/")
def get_comments_of_given_article(article_id: str, order_type: int = 1):
    query = {"article_id": article_id}
    comments = comment_collection.find(query).sort("date",order_type)
    serialized_comments = [serialize_document(comment) for comment in comments]
    return serialized_comments

