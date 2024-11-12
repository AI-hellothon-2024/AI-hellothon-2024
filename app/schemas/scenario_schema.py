#스키마 정의
from pydantic import BaseModel

class ScenarioCreate(BaseModel):
    scenarioNum: str
    scenarioDetail: str

# class UserResponse(BaseModel):
#     id: int
#     name: str
#     email: EmailStr
#
#     class Config:
#         orm_mode = True
