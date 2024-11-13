# main.py 앱 진입점
from fastapi import FastAPI
from app.api.endpoints import scenario
from app.core.config import settings

app = FastAPI(title="AI헬로우톤^ㅡ^", description="API Documentation", version="1.0.0")

app.include_router(scenario.router, prefix="/scenario", tags=["scenario"])

@app.get("/")
async def root():
    return {"message": settings.ML_API_KEY }


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
