# app/api/endpoints/scenario.py

from fastapi import APIRouter, HTTPException, status, Request
from app.schemas.scenario_schema import (
    ScenarioCreateRequest, ScenarioCreateResponse,
    ScenarioAnswerRequest, ScenarioAnswerResponse,
    ScenarioResultRequest, ScenarioResultResponse
)
from app.services.scenario_service import (
    create_scenario, save_answer, get_scenario_results, get_scenario_results_by_id
)
from fastapi import Query

router = APIRouter()


@router.post("", response_model=ScenarioCreateResponse)
async def create_scenario_endpoint(request: ScenarioCreateRequest, client_request: Request):
    try:
        scenario = await create_scenario(request, client_request)
        return scenario
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI콘텐츠 생성 오류: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"DB 저장 오류: {str(e)}"
        )


@router.post("/answer", response_model=ScenarioAnswerResponse)
async def answer_scenario_endpoint(request: ScenarioAnswerRequest, client_request: Request):
    try:
        next_scenario = await save_answer(request, client_request)
        return next_scenario
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI콘텐츠 생성 오류: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"DB 저장 오류: {str(e)}"
        )

@router.post("/result", response_model=ScenarioResultResponse)
async def result_scenario_endpoint(request: ScenarioResultRequest):
    result = await get_scenario_results(request)
    return result

@router.get("/result", response_model=ScenarioResultResponse)
async def get_result_by_id(result_id: str = Query(..., alias="resultId")):
    try:
        result = await get_scenario_results_by_id(result_id)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"결과를 찾을 수 없습니다: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"결과 조회 오류: {str(e)}"
        )