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
    scenarioStep: str
    scenarioContent: str
    scenarioImage: str
    scenarioId: str


class ScenarioAnswerRequest(BaseModel):
    userId: str
    scenarioIds: List[str]
    answer: str


class ScenarioAnswerResponse(BaseModel):
    userId: str
    scenarioStep: str
    scenarios: List[dict]
    scenarioImage: str
    scenarioId: str


class ScenarioResultRequest(BaseModel):
    userId: str
    scenarioIds: List[str]


class ScenarioResultResponse(BaseModel):
    resultId: str
    userId: str
    resultImage: str
    resultContent: str
    scenarios: List[dict]