from pydantic import BaseModel
from typing import Union

class Comment(BaseModel):
    date: str
    title: str
    body: Union[str, None] = None
    article_id: str
    author_id: str