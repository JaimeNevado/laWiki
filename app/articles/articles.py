from sqlite3 import Date
from pydantic import BaseModel
from typing import Union

class Article(BaseModel):
    name: Union[str, None] = None
    text: Union[str, None] = None
    attachedFiles: Union[str, None] = None
    author : Union[str, None] = None
    images : Union[str, None] = None
    googleMaps : Union[str, None] = None
    date : Union[str, None] = None


