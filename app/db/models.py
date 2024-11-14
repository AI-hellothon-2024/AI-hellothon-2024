# DB 모델 정의
from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Scenario(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    description: str

