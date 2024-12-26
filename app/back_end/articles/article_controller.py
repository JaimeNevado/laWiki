from fastapi import Depends, FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Union
from bson import ObjectId
from datetime import datetime, timezone
from httpx import AsyncClient
import sys
import os
from articles import Article

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document, isostr_to_date
from image_upload import ImageUploader
from authentication import Authentication

sys.path.append(os.path.abspath("../comments"))
from comments import Comment
from typing import List, Optional, Union

# URLs for microservices
COMMENTS_URL = "http://127.0.0.1:13002"
COMMENTS_URL_DOCKER = "http://comments-1"

WIKI_URL = "http://127.0.0.1:13000"
WIKI_URL_DOCKER = "http://wikis-1"

image_uploader = ImageUploader()
# Database connection
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Articles")

# Initializing authentication
auth = Authentication()

# FastAPI router
router = FastAPI()

# CORS configuration
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

# Base path
path = "/api/v1/"
# investigación de imagenes
path2 = "/api/v2/"

# Article model
# class Article(BaseModel):
#     name: str = Field(..., min_length=1, max_length=255, description="Name of the article")
#     author: str = Field(..., min_length=1, max_length=100, description="Author's name")
#     content: str = Field(..., description="Main content of the article")
#     images: Optional[List[str]] = Field(default=[], description="List of image URLs")
#     wikiID: str = Field(..., description="Wiki ID associated with the article")
#     short_text: Optional[str] = Field(default=None, max_length=500, description="Short summary of the article")


# GET all articles
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

    articles = collection.find(query).sort("wikiID", order_type)
    serialized_articles = [serialize_document(article) for article in articles]
    return serialized_articles


# GET articles with preview
@router.get(path + "articles/preview")
async def get_articles_preview(
    wikiID: Union[str, None] = None,
    name: Union[str, None] = None,
    random: bool = False,
    num_of_article: int = 10,
    author: Union[str, None] = None,
    date_from: datetime = None,
    date_to: datetime = None,
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
    elif date_from:
        query.append({"$match": {"date": {"$gte": date_from}}})
    elif date_to:
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

    articles = collection.aggregate(query)
    serialized_articles = [serialize_document(article) for article in articles]
    return serialized_articles


# GET one article by ID
@router.get(path + "articles/{article_id}")
async def get_article_by_id(article_id: str):
    article = collection.find_one({"_id": ObjectId(article_id)})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    serialized_article = serialize_document(article)
    return isostr_to_date(serialized_article)


# POST create an article
@router.post(path + "articles")
async def post_article(article: Article, user_info: dict = Depends(auth.verify_token)):
    try:
        article_dict = article.dict()
        article_dict["date"] = datetime.now(timezone.utc)

        result = collection.insert_one(article_dict)
        return {
            "msg": "Article was created successfully",
            "inserted_id": str(result.inserted_id),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create article: {e}")


# PUT update an article
@router.put(path + "articles/{id}")
async def update_article(
    id: str, article: Article, user_info: dict = Depends(auth.verify_token)
):
    updated = collection.find_one_and_update(
        {"_id": ObjectId(id)}, {"$set": article.to_dict()}
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article was updated successfully"}


# DELETE an article
@router.delete(path + "articles/{id}")
async def delete_article(id: str, user_info: dict = Depends(auth.verify_token)):
    deleted = collection.find_one_and_delete({"_id": ObjectId(id)})
    if not deleted:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article was deleted successfully"}


# DELETE articles by wikiID
@router.delete(path + "articles/wiki/{id}")
async def delete_articles_by_wiki(
    id: str, user_info: dict = Depends(auth.verify_token)
):
    result = collection.delete_many({"wikiID": id})
    return {"msg": f"Removed {result.deleted_count} articles"}


# GET comments for an article
@router.get(path + "articles/{article_id}/comments")
async def get_comments(article_id: str, date_order: int = 1):
    async with AsyncClient() as client:
        response = await client.get(
            f"{COMMENTS_URL}{path}comments",
            params={"article_id": article_id, "date_order": date_order},
        )
        response.raise_for_status()
        return response.json()


# POST comment for an article
@router.post(path + "articles/{article_id}/comments")
async def create_comment(
    article_id: str, comment: Comment, user_info: dict = Depends(auth.verify_token)
):
    async with AsyncClient() as client:
        comment_data = comment.dict()
        comment_data["article_id"] = article_id

        response = await client.post(f"{COMMENTS_URL}{path}comments", json=comment_data)
        response.raise_for_status()
        return response.json()


# GET wiki for an article
@router.get(path + "articles/{article_id}/wiki")
async def get_wiki(article_id: str):
    article = await get_article_by_id(article_id)
    wiki_id = article.get("wikiID")
    if not wiki_id:
        raise HTTPException(status_code=404, detail="Wiki not found for this article")

    async with AsyncClient() as client:
        response = await client.get(f"{WIKI_URL_DOCKER}{path}wikis/{wiki_id}")
        response.raise_for_status()
        return response.json()


####v2
@router.post(path + "upload_images")
async def upload_images(
    files: List[UploadFile] = File(...), user_info: dict = Depends(auth.verify_token)
):
    urls = await image_uploader.upload_images(files)
    return {"urls": urls}


class RestoreVersionRequest(BaseModel):
    version_number: int


@router.put(path + "articles/{id}/restore")
async def restore_version(
    id: str,
    request: RestoreVersionRequest,
    user_info: dict = Depends(auth.verify_token),
):
    # Busca el artículo por su ID
    article = collection.find_one({"_id": ObjectId(id)})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Encuentra la versión solicitada en la lista de versiones
    version_to_restore = next(
        (
            v
            for v in article.get("versions", [])
            if v["version"] == request.version_number
        ),
        None,
    )
    if not version_to_restore:
        raise HTTPException(status_code=404, detail="Version not found")

    # Actualiza los campos del artículo con los datos de la versión seleccionada
    update_fields = {
        "text": version_to_restore.get("text"),
        "short_text": version_to_restore.get("short_text", ""),
        "images": version_to_restore.get("images", []),
        "author": version_to_restore.get("author", ""),
        "googleMaps": version_to_restore.get("googleMaps", ""),
        "date": version_to_restore.get("date", datetime.now(timezone.utc)),
    }
    updated = collection.find_one_and_update(
        {"_id": ObjectId(id)}, {"$set": update_fields}
    )
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to restore version")

    return {"message": "Version restored successfully"}
