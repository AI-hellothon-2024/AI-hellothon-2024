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
from app.services.ai_service import llm_scenario_create, image_create

db = get_database()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_sample_image():
    with open("app/sample-image.png", "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


async def create_scenario(request: ScenarioCreateRequest, client_request: Request) -> ScenarioCreateResponse:
    # 리퀘스트 JSON 데이터를 그대로 담고 컬럼 추가 예시
    # scenario_data = request.dict()
    # scenario_data["scenarioStep"] = "1"
    user_data = {
        "userId": request.userId,
        "job": request.job,
        "situation": request.situation,
        "userName": request.userName,
        "gender": request.gender,
        "create_date": settings.CURRENT_DATETIME,
        "ip_address": client_request.client.host
    }
    await db["users"].insert_one(user_data)

    # llm_scenario_create(job, situation, gender, scenario_id, scenario_step, user_id)
    llm_result = llm_scenario_create(request.job, request.situation, request.gender, "", "1", request.userId)
    encode_image = image_create(llm_result, request.gender)

    scenario_data = {
        "create_date": settings.CURRENT_DATETIME,
        "userId": request.userId,
        "ip_address": client_request.client.host,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "scenarioImage": encode_image
    }

    insert_scenario = await db["scenarios"].insert_one(scenario_data)
    scenario_id = str(insert_scenario.inserted_id)

    response_data = {
        "scenarioId": scenario_id,
        "userId": request.userId,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "scenarioImage": encode_image
    }

    return ScenarioCreateResponse(**response_data)


async def save_answer(request: ScenarioAnswerRequest, client_request: Request) -> ScenarioAnswerResponse:

    answered_scenario_data = await db["scenarios"].find_one({"_id": ObjectId(request.answerScenarioId)})
    if answered_scenario_data is None:
        raise ValueError("answerScenarioId 조회 결과 없음")

    answer_data = {
        "create_date": settings.CURRENT_DATETIME,
        "userId": request.userId,
        "answer": request.answer,
        "scenarioStep": answered_scenario_data["scenarioStep"],
        "answeredScenarioId": request.answerScenarioId,
        "ip_address": client_request.client.host
    }

    await db["answers"].insert_one(answer_data)

    answered_scenarios = []

    if int(answered_scenario_data["scenarioStep"]) > 1:
        object_ids = [ObjectId(scenario_id) for scenario_id in request.scenarioIds]

        # 이전 시나리오들을 조회
        prev_scenarios_cursor = db["scenarios"].find({"_id": {"$in": object_ids}})
        prev_scenarios = await prev_scenarios_cursor.to_list(length=None)

        # 조회된 이전 시나리오에 대응하는 응답 데이터를 조회
        for scenario in prev_scenarios:
            answer = await db["answers"].find_one({"answeredScenarioId": str(scenario["_id"])})
            answered_scenarios.append({
                "scenarioContent": scenario["scenarioContent"],
                "scenarioStep": scenario.get("scenarioStep"),
                "answer": answer["answer"],
                "scenarioId": str(scenario["_id"])
            })

        answered_scenarios.append({
            "scenarioContent": answered_scenario_data["scenarioContent"],
            "scenarioStep": str(answered_scenario_data["scenarioStep"]),
            "answer": request.answer,
            "scenarioId": request.answerScenarioId
        })

        # 다음 시나리오 생성
        next_step = int(answered_scenario_data["scenarioStep"]) + 1
        if next_step > 5:
            next_step = "end"
            llm_result = "시나리오 마지막 콘텐츠 예시입니다."+str(ObjectId())[:30]
        else:
            llm_result = f"시나리오 {next_step}번째 콘텐츠 예시입니다."+str(ObjectId())[:30]

        encode_image = load_sample_image()

        scenario_data = {
            "create_date": settings.CURRENT_DATETIME,
            "userId": request.userId,
            "ip_address": client_request.client.host,
            "scenarioStep": str(next_step),
            "scenarioContent": llm_result,
            "scenarioImage": encode_image
        }

        next_scenario_insert = await db["scenarios"].insert_one(scenario_data)
        next_scenario_id = str(next_scenario_insert.inserted_id)

    else:
        # 최초 시나리오 응답일 경우
        next_step = "2"
        answered_scenarios.append({
            "scenarioContent": answered_scenario_data["scenarioContent"],
            "scenarioStep": answered_scenario_data["scenarioStep"],
            "answer": request.answer,
            "scenarioId": request.answerScenarioId
        })

        llm_result = "시나리오 두번째 콘텐츠 예시입니다."+str(ObjectId())[:30]
        encode_image = load_sample_image()

        scenario_data = {
            "create_date": settings.CURRENT_DATETIME,
            "userId": request.userId,
            "ip_address": client_request.client.host,
            "scenarioStep": str(next_step),
            "scenarioContent": llm_result,
            "scenarioImage": encode_image
        }

        next_scenario_insert = await db["scenarios"].insert_one(scenario_data)
        next_scenario_id = str(next_scenario_insert.inserted_id)

    next_scenario_data = {
        "userId": request.userId,
        "scenarios": answered_scenarios, # 이전 시나리오들 [{ }]
        "scenarioId": next_scenario_id,
        "scenarioContent": llm_result,
        "scenarioStep": str(next_step),
        "scenarioImage": encode_image
    }

    return ScenarioAnswerResponse(**next_scenario_data)


async def get_scenario_results(request: ScenarioResultRequest) -> ScenarioResultResponse:
    # Logic to retrieve all scenarios for the user
    result_data = {
        "resultId": str(ObjectId()),
        "userId": request.userId,
        "resultImage": "",
        "resultContent": "결과 내용 내용 내용 결과 내용 내용 내용 결과 내용 내용 내용 결과 내용 내용 내용 결과 내용 내용 내용 결과 내용 내용 내용",
        "scenarios": [
            {"scenarioContent": "시나리오 첫번째 콘텐츠 예시입니다.", "scenarioStep": "1", "answer": "Answer 1"},
            {"scenarioContent": "시나리오 두번째 콘텐츠 예시입니다. (이게 마지막임)", "scenarioStep": "end", "answer": ""}
        ]
    }
    return ScenarioResultResponse(**result_data)