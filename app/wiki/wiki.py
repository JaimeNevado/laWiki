from pydantic import BaseModel
from typing import Union

class Wiki(BaseModel):
    name: Union[str, None] = None
    description: Union[str, None] = None
    author: Union[str, None] = None
    # bg_image: Union[str, None] = None
    # logo: Union[str, None] = None
    # location: Union[str, None] = None