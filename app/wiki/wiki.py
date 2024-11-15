from pydantic import BaseModel
from typing import Union


class Wiki(BaseModel):
    name: Union[str, None] = None
    description: Union[str, None] = None
    author: Union[str, None] = None
    bg_image: Union[str, None] = None
    logo: Union[str, None] = None
    # location: Union[str, None] = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Lord of the Ring",
                    "description": "Wiki dedicated to the lort worl",
                    "author": "illya",
                    "bg_image": "https://example.url/image_13.png",
                    "logo": "https://example.url/image_1.png",
                }
            ]
        }
    }
