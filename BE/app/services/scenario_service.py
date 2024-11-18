import logging
import base64
import os
import re
from fastapi import Request, HTTPException
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
    with open("app/sample-image.png", "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def save_image(encoded_image: str, scenario_id: str):
    image_dir = os.path.join(os.getcwd(), "images")
    os.makedirs(image_dir, exist_ok=True)

    image_path = os.path.join(image_dir, f"{scenario_id}.png")
    with open(image_path, "wb") as image_file:
        image_file.write(base64.b64decode(encoded_image))
    logger.info(f"[save_image] Image saved to {image_path}")


async def create_scenario(request: ScenarioCreateRequest, client_request: Request) -> ScenarioCreateResponse:
    logger.info(f"Creating scenario for userId: {request.userId}")

    user_data = {
        "userId": request.userId,
        "job": request.job,
        "situation": request.situation,
        "userName": request.userName,
        "gender": request.gender,
        "create_date": settings.CURRENT_DATETIME,
        "ip_address": client_request.client.host,
        "first_scenario_id": "",
    }
    logger.info(f"[create_scenario] Inserting user data into database: {user_data}")
    user_result = await db["users"].insert_one(user_data)
    user_key = str(user_result.inserted_id)

    logger.info("[create_scenario] Calling LLM to generate scenario content...")
    content = await llm_scenario_create(
        request.job,
        request.situation,
        request.gender,
        "",
        "1",
        request.userId,
        "")
    logger.info(f"[create_scenario] LLM Result: {content}")

    llm_result_match = re.search(r"start:::\s*(.*)", content, re.DOTALL)
    setting_match = re.search(r"setting:::\s*(.*?)\n", content, re.DOTALL)

    llm_result = llm_result_match.group(1) if llm_result_match else "대화 시작 없음"
    setting = setting_match.group(1) if setting_match else "설정값 없음"

    if not setting or not llm_result:
        logger.error("[create_scenario] LLM 정확한 응답값 생성 실패")
        raise HTTPException(
            status_code=500,
            detail="LLM 정확한 응답값 생성에 실패했습니다. 다시 시도해주세요."
        )

    logger.info(f"LLM 생성 설정값: {setting if setting else '설정값 없음'}")
    logger.info(f"LLM 생성 대화: {llm_result if llm_result else '대화 시작 없음'}")

    logger.info("[create_scenario] Generating scenario image...")
    encode_image = await image_create(content, request.gender, "")

    scenario_data = {
        "create_date": settings.CURRENT_DATETIME,
        "userId": request.userId,
        "ip_address": client_request.client.host,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "settings": setting,
        "scenarioImage": encode_image
    }
    log_data_without_image(scenario_data, context="create_scenario - Scenario Data")

    insert_scenario = await db["scenarios"].insert_one(scenario_data)
    scenario_id = str(insert_scenario.inserted_id)

    save_image(encode_image, scenario_id)

    await db["users"].update_one({"_id": ObjectId(user_key)}, {"$set": {"first_scenario_id": scenario_id}})

    response_data = {
        "scenarioId": scenario_id,
        "userId": request.userId,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "scenarioImage": encode_image
    }
    response_data_without_image = {
        key: value for key, value in response_data.items() if key != "scenarioImage"
    }
    logger.info(f"[create_scenario - Response Data] Data (without encode_image): {response_data_without_image}")

    return ScenarioCreateResponse(**response_data)


async def save_answer(request: ScenarioAnswerRequest, client_request: Request) -> ScenarioAnswerResponse:
    logger.info(f"[save_answer] Saving answer for userId: {request.userId}, answerScenarioId: {request.answerScenarioId}")

    before_setting = ""
    job = ""
    gender = ""
    before_image = ""

    answered_scenario_data = await db["scenarios"].find_one({"_id": ObjectId(request.answerScenarioId)})
    if answered_scenario_data is None:
        logger.error("[save_answer] Answer scenario data not found in database.")
        raise ValueError("answerScenarioId 조회 결과 없음")

    log_data_without_image(answered_scenario_data, context="save_answer Answered scenario data:")

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

    async def process_previous_scenarios(prev_scenarios, answered_scenario_data):
        nonlocal before_setting, job, gender

        for scenario in prev_scenarios:
            answer = await db["answers"].find_one({"answeredScenarioId": str(scenario["_id"])})
            logger.info(f"[save_answer] Retrieved answer for scenario: {scenario['_id']}, answer: {answer}")
            answered_scenarios.append({
                "scenarioContent": scenario["scenarioContent"],
                "scenarioStep": scenario.get("scenarioStep"),
                "answer": answer["answer"] if answer else "",
                "scenarioId": str(scenario["_id"])
            })

            if scenario["scenarioStep"] == "1":
                before_setting = scenario["settings"]
                user_data = await db["users"].find_one({"first_scenario_id": str(scenario["_id"])})
                job = user_data.get("job", "")
                gender = user_data.get("gender", "")
                before_image = str(scenario["_id"])

        answered_scenarios.append({
            "scenarioContent": answered_scenario_data["scenarioContent"],
            "scenarioStep": str(answered_scenario_data["scenarioStep"]),
            "answer": request.answer,
            "scenarioId": request.answerScenarioId
        })

    if int(answered_scenario_data["scenarioStep"]) > 1:
        object_ids = [ObjectId(scenario_id) for scenario_id in request.scenarioIds]
        logger.info(f"[save_answer] Retrieving previous scenarios with IDs: {object_ids}")

        prev_scenarios_cursor = db["scenarios"].find({"_id": {"$in": object_ids}})
        prev_scenarios = await prev_scenarios_cursor.to_list(length=None)
        logger.info(f"[save_answer] Retrieved previous scenarios: {prev_scenarios}")

        await process_previous_scenarios(prev_scenarios, answered_scenario_data)

        next_step = int(answered_scenario_data["scenarioStep"]) + 1

        create_before_script = create_script(answered_scenarios)

        content = await llm_scenario_create(
            job, "", gender, create_before_script, next_step, request.userId, before_setting
        )
        logger.info(f"[create_scenario] LLM Result: {content}")

        llm_result, setting, is_end_match = parse_llm_content(content)

        if is_end_match == "end":
            next_step = "end"

    else:
        # 첫번째 시나리오에 대한 응답
        next_step = "2"
        answered_scenarios.append({
            "scenarioContent": answered_scenario_data["scenarioContent"],
            "scenarioStep": answered_scenario_data["scenarioStep"],
            "answer": request.answer,
            "scenarioId": request.answerScenarioId
        })

        user_data = await db["users"].find_one({"first_scenario_id": str(request.answerScenarioId)})
        job = user_data.get("job", "")
        gender = user_data.get("gender", "")
        before_image = str(request.answerScenarioId)

        create_before_script = create_script(answered_scenarios)

        content = await llm_scenario_create(
            job,
            "",
            gender,
            create_before_script,
            next_step,
            request.userId,
            answered_scenario_data.get("settings", "")
        )
        logger.info(f"[create_scenario] LLM Result: {content}")

        llm_result, setting, is_end_match = parse_llm_content(content)

        if is_end_match == "end":
            next_step = "end"

    logger.info("[create_scenario] Generating scenario image...")
    encode_image = await image_create(content, gender, before_image)

    logger.info(f"[save_answer] Creating next scenario with step: {next_step}")

    # Save next scenario
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

    next_scenario_data = {
        "userId": request.userId,
        "scenarios": answered_scenarios,
        "scenarioId": next_scenario_id,
        "scenarioContent": llm_result,
        "scenarioStep": str(next_step),
        "scenarioImage": encode_image
    }

    response_data_without_image = {
        key: value for key, value in next_scenario_data.items() if key != "scenarioImage"
    }
    logger.info(f"[save_answer - Final Response] Data (without encode_image): {response_data_without_image}")

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


def create_script(answered_scenarios):
    # answered_scenarios를 scenarioStep 기준으로 정렬
    sorted_scenarios = sorted(answered_scenarios,
                              key=lambda x: int(x["scenarioStep"]) if x["scenarioStep"].isdigit() else float('inf'))

    conversation = []
    for scenario in sorted_scenarios:
        # 상대의 대사 추가
        content = scenario.get("scenarioContent", "").strip()
        if content:
            conversation.append({"role": "assistant", "content": content})

        # 사용자의 응답 추가
        answer = scenario.get("answer", "").strip()
        if answer:
            conversation.append({"role": "user", "content": answer})

    return conversation


def parse_llm_content(content):
    llm_result_match = re.search(r"start:::\s*(.*)", content, re.DOTALL)
    setting_match = re.search(r"setting:::\s*(.*?)\n", content, re.DOTALL)
    is_end_match = re.search(r"\bend\b", content, re.IGNORECASE)

    llm_result = llm_result_match.group(1) if llm_result_match else "대화 시작 없음"
    setting = setting_match.group(1) if setting_match else "설정값 없음"
    is_end_match = "end" if is_end_match else ""

    if not setting or not llm_result:
        logger.error("[create_scenario] LLM 정확한 응답값 생성 실패")
        raise HTTPException(
            status_code=500,
            detail="LLM 정확한 응답값 생성에 실패했습니다. 다시 시도해주세요."
        )

    logger.info(f"LLM 생성 설정값: {setting if setting else '설정값 없음'}")
    logger.info(f"LLM 생성 대화: {llm_result if llm_result else '대화 시작 없음'}")

    return llm_result, setting, is_end_match
