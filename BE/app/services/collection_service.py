import logging

from app.schemas.collection_schema import CollectionListRequest, CollectionListResponse, ListItem, \
    CollectionDetailRequest, CollectionDetailResponse, ScenarioItem
from app.db.session import get_database
import json
from bson import ObjectId
from datetime import datetime

db = get_database()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def collection_list(request: CollectionListRequest) -> CollectionListResponse:
    # userId로 조회하는데, 이제 error문자열을 곁들이지 않은.. image 생성에 실패한 row...
    results_cursor = db["results"].find({
        "userId": request.userId,
        "resultImage": {"$not": {"$regex": "error"}}
    })
    results = await results_cursor.to_list(length=None)

    # 결과 리스트 생성
    result_list = [
        ListItem(
            resultId=str(result["_id"]),
            flowEvaluation=result["flowEvaluation"],
            resultImage=result["resultImage"],
            job=result["job"],
            situation=result["situation"],
            systemName=result["systemName"],
            personality=result["personality"]
        )
        for result in results
    ]

    return CollectionListResponse(
        userId=request.userId,
        result=result_list
    )


async def collection_detail(request: CollectionDetailRequest) -> CollectionDetailResponse:
    result = await db["results"].find_one({
        "userId": request.userId,
        "_id": ObjectId(request.resultId)
    })

    object_id_list = [ObjectId(id_str) for id_str in result["scenarioIds"]]
    before_scenario_data = await db["scenarios"].find_one({
        "_id": {"$in": object_id_list},
        "scenarioStep": "1"
    })

    user_data = await db["users"].find_one({
        "first_scenario_id": str(before_scenario_data["_id"])
    })

    # result가 없을 경우 예외 처리
    if not result:
        raise ValueError("결과에 대한 값을 찾을 수 없습니다.")

    # scenarios 필드 처리
    scenarios = result.get("scenarios", [])
    if isinstance(scenarios, str):  # 문자열로 저장된 경우만 JSON 파싱
        try:
            scenarios = json.loads(scenarios.strip())
        except json.JSONDecodeError as e:
            raise ValueError(f"scenarios 필드를 JSON으로 변환할 수 없습니다: {str(e)}")
    elif not isinstance(scenarios, list):  # 리스트가 아닌 경우 예외 발생
        raise ValueError("scenarios 필드는 리스트 또는 JSON 문자열이어야 합니다.")

    # scenarios 리스트를 ScenarioItem 리스트로 변환
    scenario_items = [
        ScenarioItem(
            scenarioId=scenario.get("scenarioId", ""),
            scenarioContent=scenario.get("scenarioContent", ""),
            answer=scenario.get("answer", ""),
            scenarioStep=scenario.get("scenarioStep", "")
        )
        for scenario in scenarios
    ]

    # createDate 변환 및 문자열 처리
    raw_create_date = result.get("create_date", "")
    formatted_create_date = ""
    if raw_create_date:
        try:
            # 문자열을 datetime 객체로 변환 (ISO 8601 파싱)
            dt = datetime.fromisoformat(raw_create_date)
            # 원하는 형식으로 포맷팅 후 문자열로 처리
            formatted_create_date = dt.strftime("%Y-%m-%d %H:%M:%S")
        except ValueError as e:
            raise ValueError(f"createDate 형 변환 실패 : {str(e)}")

    # CollectionDetailResponse 반환
    return CollectionDetailResponse(
        resultId=str(result["_id"]),
        userId=result["userId"],
        createDate=result["create_date"],
        oneLineResult=result["oneLineResult"],
        flowEvaluation=result["flowEvaluation"],
        flowExplanation=result["flowExplanation"],
        responseTendency=result["responseTendency"],
        goalAchievement=result["goalAchievement"],
        job=user_data["job"],
        situation=user_data["situation"],
        userName=user_data["userName"],
        gender=user_data["gender"],
        systemName=before_scenario_data["systemName"],
        personality=before_scenario_data["personality"],
        scenarios=scenario_items,
        resultImage=result["resultImage"],
    )
