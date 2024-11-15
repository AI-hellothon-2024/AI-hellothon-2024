# app/schemas/scenario_schema.py 스키마 정의

from pydantic import BaseModel
from typing import List


class ScenarioCreateRequest(BaseModel):
    userId: str
    job: str
    situation: str
    userName: str


class ScenarioCreateResponse(BaseModel):
    userId: str
    senarioStep: str
    senarioContent: str
    senarioImage: str
    senarioId: str


class ScenarioAnswerRequest(BaseModel):
    userId: str
    senarioId: str
    answer: str


class ScenarioAnswerResponse(BaseModel):
    userId: str
    senarioStep: str
    senarioContent: str
    senarioImage: str
    senarioId: str


class ScenarioResultRequest(BaseModel):
    userId: str
    senarioIds: List[str]


class ScenarioResultResponse(BaseModel):
    resultId: str
    userId: str
    resultImage: str
    resultContent: str
    senarios: List[dict]