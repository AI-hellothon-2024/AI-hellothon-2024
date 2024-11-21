# app/main.py
import logging
import os

from fastapi import FastAPI
from fastapi import Request
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from app.api.endpoints import scenario, ws_stt
from app.core.config import settings
from app.db.session import get_database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI헬로우톤^ㅡ^", description="API Documentation", version="1.0.0")

db = get_database()

# Add CORS middleware to handle OPTIONS requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 허용할 Origin을 설정 (예: ["https://example.com"])
    allow_methods=["GET", "POST", "OPTIONS"],  # 허용할 HTTP 메서드 (GET, POST, OPTIONS 등)
    allow_headers=["*"],  # 허용할 HTTP 헤더
    allow_credentials=True,  # 쿠키나 인증 정보 전달 허용 여부
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # 에러 정보 생성
    error_info = {
        "path": request.url.path,
        "method": request.method,
        "headers": dict(request.headers),
        "error_message": str(exc),
        "timestamp": settings.CURRENT_DATETIME,
    }

    # MongoDB에 에러 저장
    try:
        db["error"].insert_one(error_info)
    except Exception as db_exc:
        logger.error("Failed to log error to MongoDB: %s", str(db_exc))

    # 시스템 콘솔에 로그 출력
    logger.error(
        "ERROR::::::::::: %s\nPath: %s\nMethod: %s\nHeaders: %s\nTimestamp: %s",
        str(exc),
        request.url.path,
        request.method,
        dict(request.headers),
        settings.CURRENT_DATETIME,
    )

    # 클라이언트로 응답
    return JSONResponse(
        status_code=500,
        content={
            "message": "500에러 로그테이블 확인요청"
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # 에러 정보 생성
    error_info = {
        "path": request.url.path,
        "method": request.method,
        "headers": dict(request.headers),
        "status_code": exc.status_code,
        "error_message": exc.detail,
        "timestamp": settings.CURRENT_DATETIME,
    }

    # MongoDB에 에러 저장
    try:
        db["error"].insert_one(error_info)
    except Exception as db_exc:
        logger.error("Failed to log HTTPException to MongoDB: %s", str(db_exc))

    # 시스템 콘솔에 로그 출력
    logger.error(
        "HTTPException ::::::::: %s\nPath: %s\nMethod: %s\nHeaders: %s\nStatus: %s\nTimestamp: %s",
        exc.detail,
        request.url.path,
        request.method,
        dict(request.headers),
        exc.status_code,
        settings.CURRENT_DATETIME,
    )

    # 클라이언트로 응답
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )






@app.options("/{full_path:path}")
async def handle_options_request(full_path: str):
    response = JSONResponse(content=None)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


# 디렉토리 경로
images_directory = os.path.join(os.getcwd(), "images")

# 디렉토리 생성
if not os.path.exists(images_directory):
    os.makedirs(images_directory)

app.mount("/static", StaticFiles(directory=os.path.join(os.getcwd(), "images")), name="static")

app.include_router(scenario.router, prefix="/scenario", tags=["scenario"])
app.include_router(ws_stt.router, prefix="/ws", tags=["websocket"])


@app.get("/")
async def root():
    return RedirectResponse(url="/docs")


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}