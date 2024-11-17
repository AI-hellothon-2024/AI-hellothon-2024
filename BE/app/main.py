# app/main.py
import logging
import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import scenario, ws_stt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI헬로우톤^ㅡ^", description="API Documentation", version="1.0.0")


# Add CORS middleware to handle OPTIONS requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 허용할 Origin을 설정 (예: ["https://example.com"])
    allow_methods=["*"],  # 허용할 HTTP 메서드 (GET, POST, OPTIONS 등)
    allow_headers=["*"],  # 허용할 HTTP 헤더
    allow_credentials=True,  # 쿠키나 인증 정보 전달 허용 여부
)

app.mount("/static", StaticFiles(directory=os.path.join(os.getcwd(), "images")), name="static")

app.include_router(scenario.router, prefix="/scenario", tags=["scenario"])
app.include_router(ws_stt.router, prefix="/ws", tags=["websocket"])


@app.get("/")
async def root():
    return RedirectResponse(url="/docs")


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}