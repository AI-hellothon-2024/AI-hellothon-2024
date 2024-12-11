# app/schemas/scenario_schema.py 스키마 정의

from pydantic import BaseModel
from typing import List


class ScenarioCreateRequest(BaseModel):
    userId: str
    job: str
    situation: str
    userName: str
    gender: str
    systemName: str
    personality: str


class ScenarioCreateResponse(BaseModel):
    scenarioId: str
    userId: str
    systemName: str
    scenarioStep: str
    scenarioContent: str
    scenarioImage: str


class ScenarioAnswerRequest(BaseModel):
    userId: str
    scenarioIds: List[str]
    answerScenarioId: str
    answer: str


class ScenarioAnswerResponse(BaseModel):
    userId: str
    scenarioStep: str
    scenarioContent: str
    scenarioId: str
    scenarios: List[dict]
    scenarioImage: str


class ScenarioResultRequest(BaseModel):
    userId: str
    scenarioIds: List[str]


class ScenarioResultResponse(BaseModel):
    resultId: str
    job: str
    situation: str
    userName: str
    gender: str
    systemName: str
    personality: str
    userId: str
    oneLineResult: str
    flowEvaluation: str
    flowExplanation: str
    responseTendency: str
    goalAchievement: str
    scenarios: List[dict]
    resultImage: str

