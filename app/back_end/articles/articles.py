from sqlite3 import Date
from pydantic import BaseModel
from typing import List, Union, Optional
from datetime import datetime


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
                    "image_url": "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png",
                    "description": "beautiful something",
                }
            ]
        }
    }

class Version(BaseModel):
    version: int
    short_text: Optional[str] = None
    text: Optional[str] = None
    date: Optional[str] = None
    def to_dict(self):
        # Convertimos el objeto Version a un diccionario de Python
        return self.dict()


class Article(BaseModel):
    name: Union[str, None] = None
    short_text: Union[str, None] = None
    text: Union[str, None] = None
    attachedFiles: Union[str, None] = None
    author: Union[str, None] = None
    images: Optional[List[str]] = None
    # images: Union[List[Image], None] = None
    googleMaps: Union[str, None] = None
    date: Optional[datetime] = None  # Using ISO-8601 format
    wikiID: Union[str, None] = None
    versions: Optional[List[Version]] = []
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
                        "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png",
                        "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png",
                    ],
                    "googleMaps": "Malaga",
                    "date": "2024-11-15T22:27:54+0000",
                    "wikiID": "67535bf515ff0bae8398d4b2",
                     "versions": [
                        {
                            "version": 1,
                            "short_text" : "Katana is a Japanese Sword used by samurai",
                            "text" : "A katana is a Japanese sword characterized by a curved, single-edged blade with a circular or squared guard and long grip to accommodate two hands. Developed later than the tachi, it was used by samurai in feudal Japan and worn with the edge facing upward",
                            "date" : "2024-11-15T22:27:54+0000",
                        },
                           {
                            "version": 2,
                            "short_text" : "Katana is a Japanese Sword used by samurai",
                            "text" : "A katana(Name in japanese) is a Japanese sword characterized by a curved, single-edged blade with a circular or squared guard and long grip to accommodate two hands. Developed later than the tachi, it was used by samurai in feudal Japan and worn with the edge facing upward",
                            "date" : "2024-11-15T22:27:54+0000",
                        },
                    ],
                }
            ]
        }
    }
    def to_dict(self):
        # Convertimos el artículo completo a un diccionario
        article_dict = self.dict()
        # Convertimos cada versión a un diccionario
        article_dict['versions'] = [version.to_dict() for version in self.versions]
        return article_dict
