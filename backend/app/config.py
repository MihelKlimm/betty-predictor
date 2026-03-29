import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Telegram
    telegram_bot_token: str = ""
    twa_app_url: str = "http://localhost:5173"
    admin_tele_id: str = ""
    
    # Google Sheets
    google_sheets_id: str = ""
    google_sheets_credentials: str = "credentials.json"
    
    # Database
    database_url: str = "sqlite:///./betty.db"
    
    # Backend
    backend_url: str = "http://localhost:8000"
    
    # Frontend
    frontend_url: str = "http://localhost:5173"
    
    # TON
    ton_center_api_key: str = ""
    ton_wallet_address: str = ""
    
    # CORS
    allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:8000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields


@lru_cache()
def get_settings() -> Settings:
    return Settings()
