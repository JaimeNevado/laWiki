from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Notification(BaseModel):
    date: Optional[datetime] = None
    title: str
    body: Optional[str] = None
    opened: bool
    user_id: str

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "title": "Notification title",
                    "body": "Descriptions what this notification is about",
                    "user_id": "user id that must receive this notification",
                    "opened": False,
                }
            ]
        }
    }
