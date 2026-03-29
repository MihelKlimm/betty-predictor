import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db, UserModel
from app.telegram_bot import get_telegram_bot_manager

router = APIRouter(prefix="/api/telegram", tags=["telegram"])
logger = logging.getLogger(__name__)


@router.post("/web-app-data")
def verify_web_app_data(init_data: str, db: Session = Depends(get_db)):
    """Verify Telegram Web App data and get app token"""
    bot_manager = get_telegram_bot_manager()
    
    # Verify the data
    if not bot_manager.verify_web_app_data(init_data):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Web App data"
        )
    
    # TODO: Parse init_data to get user info
    # This would be done with proper signature verification
    
    return {
        "success": True,
        "message": "Web App data verified"
    }


@router.get("/bot-info")
def get_bot_info():
    """Get bot information for Mini App initialization"""
    bot_manager = get_telegram_bot_manager()
    
    return {
        "mini_app_url": bot_manager.get_mini_app_url(),
        "status": "active"
    }
