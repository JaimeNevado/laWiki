from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from typing import Optional
from notification import Notification
from datetime import datetime, timezone
import sys
import os

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document

# Database connection
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Notifications")

api = FastAPI()

# CORS configuration
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


# Get Notifications
@api.get(path + "notifications")
def get_notifications(user_id: Optional[str] = None, read: bool = None):

    query = {}
    if user_id is not None:
        query["user_id"] = user_id
    if read is not None:
        query["opened"] = False

    if query == {}:
        query = None

    notifications = collection.find(query).sort("date", -1)
    serialized_notifications = [
        serialize_document(notification) for notification in notifications
    ]
    return serialized_notifications


@api.get(path + "notifications/{notification_id}")
def get_notification(notification_id: str):
    query = {"_id": ObjectId(notification_id)}
    notification = collection.find_one(query)
    serialized_notification = serialize_document(notification)
    return serialized_notification


@api.get(path + "get_notifications_count")
def get_notifications_count(user_id: Optional[str] = None, read: bool = False):
    query = {}
    if user_id is not None:
        query["user_id"] = user_id
    if read is not None:
        query["opened"] = read

    if query == {}:
        query = None
    # query = {"user_id": user_id, "opened": False}
    count = collection.count_documents(query)
    return {"count": count}


# Add notification to the system
@api.post(path + "notifications")
def add_notification(notification: Notification, status_code=201):
    notification = dict(notification)
    notification["date"] = datetime.now(timezone.utc)
    notification_id = collection.insert_one(notification).inserted_id
    return {"notification_id": str(notification_id)}


@api.put(path + "notifications/{notification_id}/read")
def set_notification_as_read(notification_id: str):
    query = {"_id": ObjectId(notification_id)}
    update_result = collection.update_one(query, {"$set": {"opened": True}})
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification updated"}


@api.delete(path + "notifications/{notification_id}")
def delete_notification(notification_id: str):
    query = {"_id": ObjectId(notification_id)}
    delete_result = collection.delete_one(query)
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}
