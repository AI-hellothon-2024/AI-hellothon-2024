# app/services/scenario_service.py
import logging
import base64
from fastapi import Request
from app.db.session import get_database
from app.schemas.scenario_schema import (
    ScenarioCreateRequest, ScenarioCreateResponse,
    ScenarioAnswerRequest, ScenarioAnswerResponse,
    ScenarioResultRequest, ScenarioResultResponse
)
from bson import ObjectId
from app.core.config import settings


db = get_database()
logger = logging.getLogger(__name__)


def load_sample_image():
    with open("app/sample-image.png", "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


sampleImage = load_sample_image()


async def create_scenario(request: ScenarioCreateRequest, client_request: Request) -> ScenarioCreateResponse:
    # 리퀘스트 JSON 데이터를 그대로 담고 컬럼 추가 예시
    # scenario_data = request.dict()
    # scenario_data["scenarioStep"] = "1"
    user_data = {
        "userId": request.userId,
        "job": request.job,
        "situation": request.situation,
        "userName": request.userName,
        "create_date": settings.CURRENT_DATETIME,
        "ip_address": client_request.client.host
    }

    llm_result = "시나리오 첫번째 콘텐츠 예시입니다."

    scenario_data = {
        "create_date": settings.CURRENT_DATETIME,
        "scenarioId": str(ObjectId()),
        "userId": request.userId,
        "ip_address": client_request.client.host,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "scenarioImage": sampleImage
    }

    response_data = {
        "scenarioId": str(ObjectId()),
        "userId": request.userId,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "scenarioImage": sampleImage
    }

    await db["users"].insert_one(user_data)
    await db["scenarios"].insert_one(scenario_data)

    return ScenarioCreateResponse(**response_data)


async def save_answer(request: ScenarioAnswerRequest) -> ScenarioAnswerResponse:
    next_scenario_data = {
        "userId": request.userId,
        "scenarioStep": "end",
        "scenarios": [
            {"scenarioContent": "시나리오 첫번째 콘텐츠 예시입니다.", "scenarioStep": "1", "answer": "Answer 1"},
            {"scenarioContent": "시나리오 두번째 콘텐츠 예시입니다. (이게 마지막임)", "scenarioStep": "end", "answer": ""}
        ],
        "scenarioImage": sampleImage,
        "scenarioId": str(ObjectId())
    }
    return ScenarioAnswerResponse(**next_scenario_data)


async def get_scenario_results(request: ScenarioResultRequest) -> ScenarioResultResponse:
    # Logic to retrieve all scenarios for the user
    result_data = {
        "resultId": str(ObjectId()),
        "userId": request.userId,
        "resultImage": sampleImage,
        "resultContent": "결과 내용 내용 내용 결과 내용 내용 내용 결과 내용 내용 내용 결과 내용 내용 내용 결과 내용 내용 내용 결과 내용 내용 내용",
        "scenarios": [
            {"scenarioContent": "시나리오 첫번째 콘텐츠 예시입니다.", "scenarioStep": "1", "answer": "Answer 1"},
            {"scenarioContent": "시나리오 두번째 콘텐츠 예시입니다. (이게 마지막임)", "scenarioStep": "end", "answer": ""}
        ]
    }
    return ScenarioResultResponse(**result_data)