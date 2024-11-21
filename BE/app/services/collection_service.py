from app.schemas.collection_schema import CollectionListRequest, CollectionListResponse, ListItem, \
    CollectionDetailRequest, CollectionDetailResponse, ScenarioItem
from app.db.session import get_database
import json
from bson import ObjectId

db = get_database()

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
        )
        for result in results
    ]

    # CollectionListResponse 반환
    return CollectionListResponse(
        userId=request.userId,
        result=result_list
    )

async def collection_detail(request: CollectionDetailRequest) -> CollectionDetailResponse:
    # MongoDB에서 resultId를 기반으로 데이터 조회
    result = await db["results"].find_one({
        "userId": request.userId,
        "_id": ObjectId(request.resultId)  # MongoDB ObjectId로 매핑될 수 있음
    })

    # result가 없을 경우 예외 처리
    if not result:
        raise ValueError("해당 resultId에 대한 데이터를 찾을 수 없습니다.")

    # scenarios 필드를 JSON 문자열에서 Python 객체로 변환
    scenarios = json.loads(result.get("scenarios", "[]"))  # 기본값으로 빈 리스트를 사용

    # scenarios 필드 처리: 이미 리스트인지 확인
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

    # CollectionDetailResponse 반환
    return CollectionDetailResponse(
        resultId=str(result["_id"]),
        userId=result["userId"],
        createDate=result["createDate"],
        flowEvaluation=result["flowEvaluation"],
        flowExplanation=result["flowExplanation"],
        responseTendency=result["responseTendency"],
        goalAchievement=result["goalAchievement"],
        scenarios=scenario_items,
        resultImage=result["resultImage"],
    )