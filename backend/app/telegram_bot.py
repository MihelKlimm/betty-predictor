"""
Telegram Bot Integration for Betty Mini App
Handles user registration and redirects to Mini App
"""

import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)


class TelegramBotManager:
    """Manager for Telegram Bot operations"""
    
    def __init__(self, bot_token: str):
        self.bot_token = bot_token
        self.api_base = "https://api.telegram.org"
        self.bot_token_path = f"bot{bot_token}"
    
    def get_mini_app_url(self) -> str:
        """Get Mini App URL"""
        # This should be your deployed frontend URL
        return os.getenv("TWA_APP_URL", "http://localhost:5173")
    
    def create_start_payload(self, user_id: int) -> str:
        """Create payload for /start command"""
        return f"user_{user_id}"
    
    def verify_web_app_data(self, init_data: str) -> bool:
        """
        Verify Telegram WebApp data signature
        
        This is crucial for security - ensures the data comes from Telegram
        In production, implement proper HMAC-SHA256 verification
        """
        try:
            # TODO: Implement proper signature verification
            # For now, just basic validation
            if not init_data or len(init_data) < 10:
                return False
            return True
        except Exception as e:
            logger.error(f"Error verifying Web App data: {str(e)}")
            return False


def get_telegram_bot_manager() -> TelegramBotManager:
    """Get Telegram bot manager instance"""
    from app.config import get_settings
    settings = get_settings()
    return TelegramBotManager(settings.telegram_bot_token)
