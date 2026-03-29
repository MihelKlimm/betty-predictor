from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.db import get_db, PredictionModel, UserModel, MatchModel
from app.models import LeaderboardEntry

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("", response_model=list[LeaderboardEntry])
def get_leaderboard(week: int = None, db: Session = Depends(get_db)):
    """Get weekly leaderboard"""
    # Query all predictions with correct ones
    predictions = db.query(PredictionModel).all()
    
    # Calculate user points
    user_points = {}
    user_data = {}
    
    for user in db.query(UserModel).all():
        user_data[user.id] = {
            "username": user.username or f"User_{user.tg_id}",
            "points": 0,
            "correct_predictions": 0,
            "correct_scores": 0
        }
    
    # Calculate points based on finished matches
    for prediction in predictions:
        match = db.query(MatchModel).filter(MatchModel.id == prediction.match_id).first()
        
        if match and match.status == "finished":
            if prediction.user_id not in user_data:
                continue
            
            # Check if 1X2 prediction is correct
            if (prediction.prediction_type == "1" and match.home_score > match.away_score) or \
               (prediction.prediction_type == "2" and match.away_score > match.home_score) or \
               (prediction.prediction_type == "X" and match.home_score == match.away_score):
                user_data[prediction.user_id]["correct_predictions"] += 1
                user_data[prediction.user_id]["points"] += 1
                
                # Check if score prediction is correct
                if prediction.predicted_score:
                    if (prediction.predicted_score.get("home") == match.home_score and
                        prediction.predicted_score.get("away") == match.away_score):
                        user_data[prediction.user_id]["correct_scores"] += 1
                        user_data[prediction.user_id]["points"] += 3
    
    # Sort by points
    sorted_users = sorted(
        [(uid, data) for uid, data in user_data.items()],
        key=lambda x: x[1]["points"],
        reverse=True
    )
    
    # Create leaderboard
    leaderboard = []
    for rank, (user_id, data) in enumerate(sorted_users, 1):
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            user_id=user_id,
            username=data["username"],
            points=data["points"],
            correct_predictions=data["correct_predictions"],
            correct_scores=data["correct_scores"]
        ))
    
    return leaderboard


@router.get("/overall", response_model=list[LeaderboardEntry])
def get_overall_leaderboard(db: Session = Depends(get_db)):
    """Get overall leaderboard (same as weekly for now)"""
    return get_leaderboard(db=db)
