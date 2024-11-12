#환경설정 및 설정 관련 로직
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = ''
    SECRET_KEY: str = ''

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

settings = Settings()