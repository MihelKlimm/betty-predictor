from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


# ==================== User Models ====================

class UserCreate(BaseModel):
    tg_id: str
    username: Optional[str] = None


class User(BaseModel):
    id: str
    tg_id: str
    username: Optional[str] = None
    is_premium: bool = False
    points: int = 0
    predictions_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== Match Models ====================

class MatchCreate(BaseModel):
    home_team: str
    away_team: str
    date: str
    time: Optional[str] = None
    round: Optional[str] = None
    status: str = "upcoming"


class Match(BaseModel):
    id: str
    home_team: str
    away_team: str
    date: str
    time: Optional[str] = None
    round: Optional[str] = None
    status: str
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== Prediction Models ====================

class ScorePrediction(BaseModel):
    home: int = Field(..., ge=0, le=10)
    away: int = Field(..., ge=0, le=10)


class PredictionCreate(BaseModel):
    match_id: str
    prediction_type: str = Field(..., pattern="^[1X2]$")
    predicted_score: Optional[ScorePrediction] = None


class Prediction(BaseModel):
    id: str
    user_id: str
    match_id: str
    prediction_type: str
    predicted_score: Optional[dict] = None
    points_earned: Optional[int] = None
    created_at: datetime
    match: Optional[Match] = None

    class Config:
        from_attributes = True


# ==================== Leaderboard Models ====================

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    username: str
    points: int
    correct_predictions: int
    correct_scores: int


# ==================== Rewards Models ====================

class Reward(BaseModel):
    id: str
    user_id: str
    week: int
    points: int
    ton_amount: float
    status: str
    claimed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
