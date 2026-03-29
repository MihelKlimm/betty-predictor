from fastapi import APIRouter

# Import all routers
from app.api import users, matches, predictions, leaderboard, rewards, ton, telegram

# Create main router
api_router = APIRouter()

# Include all routers
api_router.include_router(users.router)
api_router.include_router(matches.router)
api_router.include_router(predictions.router)
api_router.include_router(leaderboard.router)
api_router.include_router(rewards.router)
api_router.include_router(ton.router)
api_router.include_router(telegram.router)
