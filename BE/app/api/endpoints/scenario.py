# app/api/endpoints/scenario.py

from fastapi import APIRouter, HTTPException
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
async def create_scenario_endpoint(request: ScenarioCreateRequest):
    scenario = await create_scenario(request)
    return scenario


@router.post("/answer", response_model=ScenarioAnswerResponse)
async def answer_scenario_endpoint(request: ScenarioAnswerRequest):
    answer = await save_answer(request)
    return answer


@router.post("/result", response_model=ScenarioResultResponse)
async def result_scenario_endpoint(request: ScenarioResultRequest):
    result = await get_scenario_results(request)
    return result