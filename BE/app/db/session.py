import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    logger.info("Connecting to the database...")
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    database = client[settings.DATABASE_NAME]
    logger.info("Database connection established successfully. DB Name: %s", settings.DATABASE_NAME)
except Exception as e:
    logger.error("Failed to connect to the database: %s", e)
    raise e


def get_database():
    logger.info("get_database() called")
    return database
