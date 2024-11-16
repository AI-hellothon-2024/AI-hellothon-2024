# app/api/endpoints/scenario.py

from fastapi import APIRouter, HTTPException, status, Request
from app.schemas.scenario_schema import (
    ScenarioCreateRequest, ScenarioCreateResponse,
    ScenarioAnswerRequest, ScenarioAnswerResponse,
    ScenarioResultRequest, ScenarioResultResponse
)
from app.services.scenario_service import (
    create_scenario, save_answer, get_scenario_results
)

router = APIRouter()


@router.post("/", response_model=ScenarioCreateResponse)
async def create_scenario_endpoint(request: ScenarioCreateRequest, client_request: Request):
    try:
        scenario = await create_scenario(request, client_request)
        return scenario
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LLM 생성 오류: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"DB 저장 오류: {str(e)}"
        )


@router.post("/answer", response_model=ScenarioAnswerResponse)
async def answer_scenario_endpoint(request: ScenarioAnswerRequest):
    answer = await save_answer(request)
    return answer


@router.post("/result", response_model=ScenarioResultResponse)
async def result_scenario_endpoint(request: ScenarioResultRequest):
    result = await get_scenario_results(request)
    return result
