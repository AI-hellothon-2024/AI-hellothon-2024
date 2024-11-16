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

# Set logging level tr.INFO
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_data_without_image(data: dict, context: str = "General"):
    data_without_image = {key: value for key, value in data.items() if key != "scenarioImage"}
    logger.info(f"[{context}] Data (without encode_image): {data_without_image}")


def load_sample_image():
    """
    Load a sample image and encode it in base64.
    """
    with open("app/sample-image.png", "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


async def create_scenario(request: ScenarioCreateRequest, client_request: Request) -> ScenarioCreateResponse:
    logger.info(f"Creating scenario for userId: {request.userId}")

    user_data = {
        "userId": request.userId,
        "job": request.job,
        "situation": request.situation,
        "userName": request.userName,
        "gender": request.gender,
        "create_date": settings.CURRENT_DATETIME,
        "ip_address": client_request.client.host
    }
    logger.info(f"[create_scenario] Inserting user data into database: {user_data}")
    await db["users"].insert_one(user_data)

    logger.info("[create_scenario] Calling LLM to generate scenario content...")
    llm_result = llm_scenario_create(request.job, request.situation, request.gender, "", "1", request.userId)
    logger.info(f"[create_scenario] LLM Result: {llm_result}")

    logger.info("[create_scenario] Generating scenario image...")
    encode_image = image_create(llm_result, request.gender)

    scenario_data = {
        "create_date": settings.CURRENT_DATETIME,
        "userId": request.userId,
        "ip_address": client_request.client.host,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "scenarioImage": encode_image
    }
    log_data_without_image(scenario_data, context="create_scenario - Scenario Data")

    insert_scenario = await db["scenarios"].insert_one(scenario_data)
    scenario_id = str(insert_scenario.inserted_id)

    response_data = {
        "scenarioId": scenario_id,
        "userId": request.userId,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "scenarioImage": encode_image
    }
    log_data_without_image(response_data, context="create_scenario - Response Data")
    logger.info(f"[create_scenario] Scenario created successfully")

    return ScenarioCreateResponse(**response_data)


async def save_answer(request: ScenarioAnswerRequest, client_request: Request) -> ScenarioAnswerResponse:
    logger.info(
        f"[save_answer] Saving answer for userId: {request.userId}, answerScenarioId: {request.answerScenarioId}")

    answered_scenario_data = await db["scenarios"].find_one({"_id": ObjectId(request.answerScenarioId)})
    if answered_scenario_data is None:
        logger.error("[save_answer] Answer scenario data not found in database.")
        raise ValueError("answerScenarioId 조회 결과 없음")

    logger.info(f"[save_answer] Answered scenario data: {answered_scenario_data}")

    answer_data = {
        "create_date": settings.CURRENT_DATETIME,
        "userId": request.userId,
        "answer": request.answer,
        "scenarioStep": answered_scenario_data["scenarioStep"],
        "answeredScenarioId": request.answerScenarioId,
        "ip_address": client_request.client.host
    }
    logger.info(f"[save_answer] Inserting answer data into database: {answer_data}")
    await db["answers"].insert_one(answer_data)

    answered_scenarios = []

    if int(answered_scenario_data["scenarioStep"]) > 1:
        object_ids = [ObjectId(scenario_id) for scenario_id in request.scenarioIds]
        logger.info(f"[save_answer] Retrieving previous scenarios with IDs: {object_ids}")

        prev_scenarios_cursor = db["scenarios"].find({"_id": {"$in": object_ids}})
        prev_scenarios = await prev_scenarios_cursor.to_list(length=None)
        logger.info(f"[save_answer] Retrieved previous scenarios: {prev_scenarios}")

        for scenario in prev_scenarios:
            answer = await db["answers"].find_one({"answeredScenarioId": str(scenario["_id"])})
            logger.info(f"[save_answer] Retrieved answer for scenario: {scenario['_id']}, answer: {answer}")
            answered_scenarios.append({
                "scenarioContent": scenario["scenarioContent"],
                "scenarioStep": scenario.get("scenarioStep"),
                "answer": answer["answer"] if answer else "",
                "scenarioId": str(scenario["_id"])
            })

        answered_scenarios.append({
            "scenarioContent": answered_scenario_data["scenarioContent"],
            "scenarioStep": str(answered_scenario_data["scenarioStep"]),
            "answer": request.answer,
            "scenarioId": request.answerScenarioId
        })

        next_step = int(answered_scenario_data["scenarioStep"]) + 1
        if next_step > 5:
            next_step = "end"
            llm_result = "시나리오 마지막 콘텐츠 예시입니다." + str(ObjectId())[:30]
        else:
            llm_result = f"시나리오 {next_step}번째 콘텐츠 예시입니다." + str(ObjectId())[:30]

        logger.info(f"[save_answer] Creating next scenario with step: {next_step}")
        encode_image = load_sample_image()

        scenario_data = {
            "create_date": settings.CURRENT_DATETIME,
            "userId": request.userId,
            "ip_address": client_request.client.host,
            "scenarioStep": str(next_step),
            "scenarioContent": llm_result,
            "scenarioImage": encode_image
        }
        log_data_without_image(scenario_data, context="save_answer - Next Scenario Data")
        next_scenario_insert = await db["scenarios"].insert_one(scenario_data)
        next_scenario_id = str(next_scenario_insert.inserted_id)

    else:
        next_step = "2"
        answered_scenarios.append({
            "scenarioContent": answered_scenario_data["scenarioContent"],
            "scenarioStep": answered_scenario_data["scenarioStep"],
            "answer": request.answer,
            "scenarioId": request.answerScenarioId
        })

        llm_result = "시나리오 두번째 콘텐츠 예시입니다." + str(ObjectId())[:30]
        encode_image = load_sample_image()

        scenario_data = {
            "create_date": settings.CURRENT_DATETIME,
            "userId": request.userId,
            "ip_address": client_request.client.host,
            "scenarioStep": str(next_step),
            "scenarioContent": llm_result,
            "scenarioImage": encode_image
        }
        log_data_without_image(scenario_data, context="save_answer - Second Scenario Data")
        next_scenario_insert = await db["scenarios"].insert_one(scenario_data)
        next_scenario_id = str(next_scenario_insert.inserted_id)

    next_scenario_data = {
        "userId": request.userId,
        "scenarios": answered_scenarios,
        "scenarioId": next_scenario_id,
        "scenarioContent": llm_result,
        "scenarioStep": str(next_step),
        "scenarioImage": encode_image
    }
    log_data_without_image(next_scenario_data, context="save_answer - Final Response")
    logger.info("[save_answer] Answer saved successfully")

    return ScenarioAnswerResponse(**next_scenario_data)


async def get_scenario_results(request: ScenarioResultRequest) -> ScenarioResultResponse:
    logger.info(f"[get_scenario_results] Retrieving results for userId: {request.userId}")

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
    logger.info(f"[get_scenario_results] Retrieved result data: {result_data}")

    return ScenarioResultResponse(**result_data)
