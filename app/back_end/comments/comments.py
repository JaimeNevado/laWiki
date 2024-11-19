from pydantic import BaseModel
from typing import Union


class Comment(BaseModel):
    date: str
    title: str
    body: Union[str, None] = None
    article_id: str
    author_id: str

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "date": "2024-11-15T22:45:47+0000",
                    "title": "Regarding that phrase",
                    "body": "I think better to say it would be...",
                    "article_id": "672b6bbe4de836fec6f7cf9f",
                    "author_id": "672b6bbe4de836fec6f7cf9f",
                }
            ]
        }
    }
