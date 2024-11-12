# from sqlalchemy.orm import Session
# from app.db.models import User
from app.schemas.scenario_schema import ScenarioCreate

def create_scenario(scenario_request: ScenarioCreate):
    # fake_hashed_password = user.password + "notreallyhashed"
    # db_user = User(name=user.name, email=user.email, hashed_password=fake_hashed_password)
    # db.add(db_user)
    # db.commit()
    # db.refresh(db_user)

    #### Scenario 생성 로직 ####
    scenario = ScenarioCreate(scenarioNum="testNum",scenarioDetail="테스트 시나리오 입니다?")

    return scenario
