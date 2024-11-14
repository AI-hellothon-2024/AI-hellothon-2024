# from sqlalchemy.orm import Session
# from app.db.models import User
from app.db.session import get_database
from app.schemas.scenario_schema import ScenarioCreate
from bson import ObjectId

db = get_database()

async def create_scenario(scenario_request: ScenarioCreate):
    result = await db["scenario"].insert_one(scenario_request.dict(by_alias=True))

    #### Scenario 생성 로직 ####
    scenario = ScenarioCreate(scenarioNum=str(result.inserted_id),scenarioDetail="테스트 시나리오 입니다?")

    return scenario

