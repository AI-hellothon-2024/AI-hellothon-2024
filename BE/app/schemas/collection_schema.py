from pydantic import BaseModel
from typing import List


class CollectionListRequest(BaseModel):
    userId: str


class ListItem(BaseModel):
    resultId: str
    flowEvaluation: str
    resultImage: str


class CollectionListResponse(BaseModel):
    userId: str
    result: List[ListItem]


class ScenarioItem(BaseModel):
    scenarioId: str
    scenarioContent: str
    answer: str
    scenarioStep: str


class CollectionDetailResponse(BaseModel):
    resultId: str
    userId: str
    createDate: str
    flowEvaluation: str
    flowExplanation: str
    responseTendency: str
    goalAchievement: str
    scenarios: List[ScenarioItem]
    resultImage: str


class CollectionDetailRequest(BaseModel):
    userId: str
    resultId: str
