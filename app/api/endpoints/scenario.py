# 시나리오 관련 로직
from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from app.db.session import SessionLocal
from app.schemas.scenario_schema import ScenarioCreate
from app.services.scenario_service import create_scenario

router = APIRouter()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.post("/", response_model=UserResponse)
# def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
#     return create_user(db=db, user=user)

@router.post("/", response_model=ScenarioCreate)
def scenario_create(scenario_request: ScenarioCreate):
    scenario = create_scenario(scenario_request=scenario_request)
    return scenario