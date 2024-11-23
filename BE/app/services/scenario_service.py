import base64
import logging
import os
import re

from bson import ObjectId
from fastapi import Request, HTTPException

from app.core.config import settings
from app.db.session import get_database
from app.schemas.scenario_schema import (
    ScenarioCreateRequest, ScenarioCreateResponse,
    ScenarioAnswerRequest, ScenarioAnswerResponse,
    ScenarioResultRequest, ScenarioResultResponse
)
from app.services.ai_service import llm_scenario_create, image_create, llm_result_create, result_image_create, \
    toxic_check, one_line_result

db = get_database()

# Set logging level tr.INFO
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_data_without_image(data: dict, context: str = "General"):
    data_without_image = {key: value for key, value in data.items() if key != "scenarioImage"}
    logger.info(f"[{context}] Data (without encode_image): {data_without_image}")


async def save_image(encoded_image: str, image_id: str, is_result=False):
    image_dir = os.path.join(os.getcwd(), "images")
    os.makedirs(image_dir, exist_ok=True)

    if is_result:
        image_path = os.path.join(image_dir, f"result_{image_id}.png")
    else:
        image_path = os.path.join(image_dir, f"{image_id}.png")

    with open(image_path, "wb") as image_file:
        image_file.write(base64.b64decode(encoded_image))


async def create_scenario(request: ScenarioCreateRequest, client_request: Request) -> ScenarioCreateResponse:
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

    system_name = request.systemName
    # await get_korean_name(request.userId, request.gender)

    user_result = await db["users"].insert_one(user_data)
    user_key = str(user_result.inserted_id)

    content = await llm_scenario_create(
        request.job,
        request.situation,
        request.gender,
        "",
        "1",
        request.userId,
        request.personality,
        request.userName,
        request.systemName
    )

    llm_result_match = re.search(r"start:::\s*(.*)", content, re.DOTALL)

    llm_result = llm_result_match.group(1) if llm_result_match else "대화 시작 없음"
    setting_search = await db["situations"].find_one({"name": request.situation})
    setting = str(setting_search.get("description", "기본값")) if setting_search else "기본값"

    if not llm_result:
        raise HTTPException(
            status_code=500,
            detail="LLM 정확한 응답값 생성에 실패했습니다. 다시 시도해주세요."
        )

    encode_image = await image_create(content, request.gender, setting)

    scenario_data = {
        "create_date": settings.CURRENT_DATETIME,
        "userId": request.userId,
        "ip_address": client_request.client.host,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "settings": setting,
        "systemName": system_name,
        "personality": request.personality,
        "scenarioImage": encode_image
    }
    log_data_without_image(scenario_data, context="create_scenario - Scenario Data")

    insert_scenario = await db["scenarios"].insert_one(scenario_data)
    scenario_id = str(insert_scenario.inserted_id)

    await save_image(encode_image, scenario_id)

    await db["users"].update_one({"_id": ObjectId(user_key)}, {"$set": {"first_scenario_id": scenario_id}})

    response_data = {
        "scenarioId": scenario_id,
        "userId": request.userId,
        "systemName": system_name,
        "scenarioStep": "1",
        "scenarioContent": llm_result,
        "scenarioImage": encode_image
    }
    return ScenarioCreateResponse(**response_data)


async def save_answer(request: ScenarioAnswerRequest, client_request: Request) -> ScenarioAnswerResponse:
    logger.info(
        f"[save_answer] Saving answer for userId: {request.userId}, answerScenarioId: {request.answerScenarioId}")

    job = ""
    gender = ""

    is_toxic = await toxic_check(request.answer)

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
    await db["answers"].insert_one(answer_data)

    answered_scenarios = []
    before_situation = ""
    before_settings = ""
    before_personality = ""
    before_system_name = ""
    before_user_name = ""

    async def process_previous_scenarios(prev_scenarios, answered_scenario_data):
        nonlocal job, gender, before_situation, before_settings, before_personality, before_system_name, before_user_name

        for scenario in prev_scenarios:
            answer = await db["answers"].find_one({"answeredScenarioId": str(scenario["_id"])})
            answered_scenarios.append({
                "scenarioContent": scenario["scenarioContent"],
                "scenarioStep": scenario.get("scenarioStep"),
                "answer": answer["answer"] if answer else "",
                "scenarioId": str(scenario["_id"])
            })

            if scenario["scenarioStep"] == "1":
                user_data = await db["users"].find_one({"first_scenario_id": str(scenario["_id"])})
                job = user_data.get("job", "")
                gender = user_data.get("gender", "")
                before_personality = scenario["personality"]
                before_situation = user_data.get("situation", "")
                before_settings = scenario["settings"]
                before_system_name = scenario["systemName"]
                before_user_name = user_data["userName"]

        answered_scenarios.append({
            "scenarioContent": answered_scenario_data["scenarioContent"],
            "scenarioStep": str(answered_scenario_data["scenarioStep"]),
            "answer": request.answer,
            "scenarioId": request.answerScenarioId
        })

    if int(answered_scenario_data["scenarioStep"]) > 1:
        object_ids = [ObjectId(scenario_id) for scenario_id in request.scenarioIds]

        prev_scenarios_cursor = db["scenarios"].find({"_id": {"$in": object_ids}})
        prev_scenarios = await prev_scenarios_cursor.to_list(length=None)

        await process_previous_scenarios(prev_scenarios, answered_scenario_data)

        next_step = int(answered_scenario_data["scenarioStep"]) + 1

        create_before_script = create_script(answered_scenarios)

        if is_toxic:
            llm_result = "사용자의 입력이 부적절하여 대화를 종료합니다."
            next_step = "end"
        else:
            content = await llm_scenario_create(
                job, before_situation, gender, create_before_script, next_step,
                request.userId, before_personality, before_system_name, before_user_name
            )

            llm_result, is_end_match = parse_llm_content(content)

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
        before_situation = user_data.get("situation", "")
        before_settings = answered_scenario_data["settings"]
        before_personality = answered_scenario_data["personality"]
        before_system_name = answered_scenario_data["systemName"]
        before_user_name = user_data["userName"]

        create_before_script = create_script(answered_scenarios)

        content = await llm_scenario_create(
            job,
            before_situation,
            gender,
            create_before_script,
            next_step,
            request.userId,
            before_personality,
            before_user_name,
            before_system_name
        )

        if is_toxic:
            llm_result = "사용자의 입력이 부적절하여 대화를 종료합니다."
            next_step = "end"
        else:
            llm_result, is_end_match = parse_llm_content(content)
            if is_end_match == "end":
                next_step = "end"

    encode_image = await image_create(llm_result, gender, before_settings)

    # Save next scenario
    scenario_data = {
        "create_date": settings.CURRENT_DATETIME,
        "userId": request.userId,
        "ip_address": client_request.client.host,
        "scenarioStep": str(next_step),
        "scenarioContent": llm_result,
        "scenarioImage": encode_image,
        "settings": before_settings,
        "personality": before_personality,
        "systemName": before_system_name,
    }
    next_scenario_insert = await db["scenarios"].insert_one(scenario_data)
    next_scenario_id = str(next_scenario_insert.inserted_id)

    await save_image(encode_image, next_scenario_id, is_result=False)

    next_scenario_data = {
        "userId": request.userId,
        "scenarios": answered_scenarios,
        "scenarioId": next_scenario_id,
        "scenarioContent": llm_result,
        "scenarioStep": str(next_step),
        "scenarioImage": encode_image
    }

    return ScenarioAnswerResponse(**next_scenario_data)


async def get_scenario_results(request: ScenarioResultRequest) -> ScenarioResultResponse:
    existing_result = await db["results"].find_one({
        "userId": request.userId,
        "scenarioIds": {"$all": request.scenarioIds},
    })

    object_id_list = [ObjectId(id_str) for id_str in request.scenarioIds]
    before_scenario_data = await db["scenarios"].find_one({
        "_id": {"$in": object_id_list},
        "scenarioStep": "1"
    })

    user_data = await db["users"].find_one({
        "first_scenario_id": str(before_scenario_data["_id"])
    })

    if existing_result:
        existing_result["resultId"] = str(existing_result["_id"])
        del existing_result["_id"]
        existing_result["userId"] = request.userId
        existing_result["job"] = user_data["job"]
        existing_result["situation"] = user_data["situation"]
        existing_result["userName"] = user_data["userName"]
        existing_result["gender"] = user_data["gender"]
        existing_result["systemName"] = before_scenario_data["systemName"]
        existing_result["personality"] = before_scenario_data["personality"]
        return ScenarioResultResponse(**existing_result)

    gender = ""

    object_ids = [ObjectId(scenario_id) for scenario_id in request.scenarioIds]

    prev_scenarios_cursor = db["scenarios"].find({"_id": {"$in": object_ids}})
    prev_scenarios = await prev_scenarios_cursor.to_list(length=None)

    answered_scenarios = []
    for scenario in prev_scenarios:
        answer = await db["answers"].find_one({"answeredScenarioId": str(scenario["_id"])})
        answered_scenarios.append({
            "scenarioId": str(scenario["_id"]),
            "scenarioContent": scenario["scenarioContent"],
            "answer": answer["answer"] if answer else "",
            "scenarioStep": scenario.get("scenarioStep"),
        })
        if scenario.get("scenarioStep") == "1":
            user_data = await db["users"].find_one({"first_scenario_id": str(scenario["_id"])})
            gender = user_data.get("gender", "")

    prev_scenarios_script = create_script(answered_scenarios)

    llm_result = await llm_result_create(prev_scenarios_script, request.userId)

    flow_evaluation, flow_explanation, response_tendency, goal_achievement = result_llm_content(llm_result)

    encode_image = await result_image_create(flow_evaluation, gender)

    one_line = await one_line_result(flow_explanation, response_tendency, goal_achievement, request.userId)

    result_data = {
        "userId": request.userId,
        "flowEvaluation": flow_evaluation,
        "oneLineResult": one_line,
        "flowExplanation": flow_explanation,
        "responseTendency": response_tendency,
        "goalAchievement": goal_achievement,
        "scenarios": answered_scenarios,
        "create_date": settings.CURRENT_DATETIME,
        "resultImage": encode_image,
        "job": user_data["job"],
        "situation": user_data["situation"],
        "scenarioIds": request.scenarioIds,
        "systemName": before_scenario_data["systemName"],
        "personality": before_scenario_data["personality"],
        "userName": user_data["userName"],
        "gender": user_data["gender"]
    }
    result_id = await db["results"].insert_one(result_data)
    result_data["resultId"] = str(result_id.inserted_id)

    await save_image(encode_image, str(result_id.inserted_id), is_result=True)

    return ScenarioResultResponse(**result_data)


async def get_scenario_results_by_id(scenario_id: str) -> ScenarioResultResponse:
    result_data = await db["results"].find_one({"_id": ObjectId(scenario_id)})

    if not result_data:
        raise ValueError("결과를 찾을 수 없습니다.")

    if result_data:
        result_data["resultId"] = str(result_data["_id"])
        del result_data["_id"]
        return ScenarioResultResponse(**result_data)

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
    # setting_match = re.search(r"setting:::\s*(.*?)\n", content, re.DOTALL)
    is_end_match = re.search(r"\bend\b", content, re.IGNORECASE)

    # step::: end 이란 단어가 있으면 이부분만 삭제하고 content로 사용
    if (re.search(r"step::: end", content)):
        content = re.sub(r"step::: end", "", content)

    llm_result = llm_result_match.group(1) if llm_result_match else content
    # setting = setting_match.group(1) if setting_match else "설정값 없음"
    is_end_match = "end" if is_end_match else ""

    # if not setting:
    #     raise HTTPException(
    #         status_code=500,
    #         detail="LLM 정확한 응답값 생성에 실패했습니다. 다시 시도해주세요."
    #     )

    return llm_result, is_end_match


def result_llm_content(content):
    flow_evaluation = re.search(r"종합\s*평가\s*[:：]*\s*:::\s*(.*?)\s*(?:\n|$)", content, re.DOTALL)
    flow_explanation = re.search(r"대화의\s*흐름\s*설명\s*[:：]*\s*:::\s*(.*?)\s*(?:\n|$)", content, re.DOTALL)
    response_tendency = re.search(r"대답\s*경향\s*성\s*[:：]*\s*:::\s*(.*?)\s*(?:\n|$)", content, re.DOTALL)
    goal_achievement = re.search(r"대화\s*목표\s*달성도\s*[:：]*\s*:::\s*(.*?)\s*(?:\n|$)", content, re.DOTALL)

    flow_evaluation = flow_evaluation.group(1).lower() if flow_evaluation else ""
    flow_explanation = flow_explanation.group(1) if flow_explanation else ""
    response_tendency = response_tendency.group(1) if response_tendency else ""
    goal_achievement = goal_achievement.group(1) if goal_achievement else ""

    return flow_evaluation, flow_explanation, response_tendency, goal_achievement
