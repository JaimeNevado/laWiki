from sqlite3 import Date
from pydantic import BaseModel
from typing import List, Union, Optional


class Image(BaseModel):
    """
    Its possible we would need to implement this image storing format and add even more fields to it
    """

    image_url: str
    description: str

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "image_url": "https://example.url/image_123.png",
                    "description": "beautiful something",
                }
            ]
        }
    }


class Article(BaseModel):
    name: Union[str, None] = None
    short_text: Union[str, None] = None
    text: Union[str, None] = None
    attachedFiles: Union[str, None] = None
    author: Union[str, None] = None
    images: Optional[List[str]] = None
    # images: Union[List[Image], None] = None
    googleMaps: Union[str, None] = None
    date: Union[str, None] = None  # Using ISO-8601 format
    wikiID: Union[str, None] = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Katana",
                    "text": "A katana is a Japanese sword characterized by a curved, single-edged blade with a circular or squared guard and long grip to accommodate two hands. Developed later than the tachi, it was used by samurai in feudal Japan and worn with the edge facing upward",
                    "short_text": "Katana is a Japanese Sword used by samurai",
                    "attachedFiles": "https://example.url",
                    "author": "illya",
                    "images": [
                        "https://example.url/image_123.png",
                        "https://example.url/image_3.png",
                    ],
                    "googleMaps": "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=places&callback=initMap",
                    "date": "2024-11-15T22:27:54+0000",
                    "wikiID": "672b6bbe4de836fec6f7cf9f",
                }
            ]
        }
    }
