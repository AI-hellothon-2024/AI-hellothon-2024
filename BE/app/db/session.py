import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

# Logger 설정
logger = logging.getLogger(__name__)

try:
    logger.info("Connecting to the database...")
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    database = client[settings.DATABASE_NAME]
    logger.info("Database connection established successfully. DB Name: %s", settings.DATABASE_NAME)
except Exception as e:
    logger.error("Failed to connect to the database: %s", e)
    raise e  # 연결 실패 시 애플리케이션을 중단시키기 위해 예외를 다시 발생


def get_database():
    logger.debug("get_database() called")
    return database
