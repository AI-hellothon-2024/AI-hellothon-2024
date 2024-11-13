# app/core/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = ''
    ML_API_KEY: str = ''

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'


settings = Settings()
