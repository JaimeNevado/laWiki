from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Comment(BaseModel):
    date: Optional[datetime] = None
    content: Optional[str] = None
    article_id: str
    author_id: str
    rating: Optional[float] = None
    destination_id: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "content": "I think better way to say it would be...",
                    "article_id": "672b6bbe4de836fec6f7cf9f",
                    "author_id": "672b6bbe4de836fec6f7cf9f",
                    "rating": 5,
                    "destination_id": "YA2b6ZZZf"
                }
            ]
        }
    }
