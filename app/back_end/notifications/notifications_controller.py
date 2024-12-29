from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from typing import Optional
from notification import Notification
from datetime import datetime, timezone
from mailjet_rest import Client
import sys
import os

sys.path.append(os.path.abspath("../"))
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document
from authentication import Authentication

from environs import Env

env = Env()
env.read_env()
ORIGINS = env.list("ORIGINS_URL")
print("Allowed Origins: ", ORIGINS)

# Database connection
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Notifications")

# Initializing authentication
auth = Authentication()
api = FastAPI()

# CORS configuration
api.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

path = "/api/v1/"

mailjet = Client(
    auth=("10a2095833caf92998676630a3a59ea1", "229d7a05b82512777585884382b5bf1a")
)


# Get Notifications
@api.get(path + "notifications")
def get_notifications(
    user_id: Optional[str] = None,
    read: bool = None,
    user_info: dict = Depends(auth.verify_token),
):
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
    count = collection.count_documents(query)
    return {"count": count}


# Add notification to the system
@api.post(path + "notifications")
def add_notification(
    notification: Notification,
    user_info: dict = Depends(auth.verify_token),
    status_code=201,
):
    notification = dict(notification)
    notification["date"] = datetime.now(timezone.utc)
    notification_id = collection.insert_one(notification).inserted_id

    data = {
        "FromEmail": "yaelmartin@uma.es",
        "FromName": "laWiki",
        "Subject": notification["title"],
        "Text-part": notification["body"],
        "Html-part": "",
        "Recipients": [{"Email": notification["user_id"]}],
    }

    result = mailjet.send.create(data=data)
    print(result.status_code)
    print(result.json())

    return {"notification_id": str(notification_id)}


@api.put(path + "notifications/{notification_id}/read")
def set_notification_as_read(
    notification_id: str, user_info: dict = Depends(auth.verify_token)
):
    query = {"_id": ObjectId(notification_id)}
    update_result = collection.update_one(query, {"$set": {"opened": True}})

    if update_result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Notification not found or already marked as read."
        )
    return {"message": "Notification marked as read"}


@api.delete(path + "notifications/{notification_id}")
def delete_notification(
    notification_id: str, user_info: dict = Depends(auth.verify_token)
):
    query = {"_id": ObjectId(notification_id)}
    delete_result = collection.delete_one(query)
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}
