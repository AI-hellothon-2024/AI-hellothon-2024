# app/main.py
import logging
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from app.api.endpoints import scenario, ws_stt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI헬로우톤^ㅡ^", description="API Documentation", version="1.0.0")

app.include_router(scenario.router, prefix="/scenario", tags=["scenario"])
app.include_router(ws_stt.router, prefix="/ws", tags=["websocket"])


@app.get("/")
async def root():
    return RedirectResponse(url="/docs")


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}