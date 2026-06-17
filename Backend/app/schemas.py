from pydantic import BaseModel, ConfigDict
from typing import Optional

class BookBase(BaseModel):
    publisher: str
    name: str
    date: str
    Cost: float
   

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class BookResponse(BookBase):
    id: int
    owner_id: int
    owner: str

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    id: int
    username: str
    token: str

    model_config = ConfigDict(from_attributes=True)
