from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db import get_db, PredictionModel, MatchModel, UserModel
from app.models import Prediction, PredictionCreate

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.post("", response_model=Prediction)
def create_prediction(prediction_data: PredictionCreate, db: Session = Depends(get_db)):
    """Create a new prediction"""
    # TODO: Get user_id from JWT token or auth header
    # For now, use first user as placeholder
    user = db.query(UserModel).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Check if match exists
    match = db.query(MatchModel).filter(MatchModel.id == prediction_data.match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    # Check if match is still open for predictions
    if match.status == "finished":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot predict on finished match"
        )
    
    # Check if user already predicted on this match
    existing = db.query(PredictionModel).filter(
        and_(
            PredictionModel.user_id == user.id,
            PredictionModel.match_id == prediction_data.match_id
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already predicted on this match"
        )
    
    # Create prediction
    db_prediction = PredictionModel(
        user_id=user.id,
        match_id=prediction_data.match_id,
        prediction_type=prediction_data.prediction_type,
        predicted_score=prediction_data.predicted_score.model_dump() if prediction_data.predicted_score else None
    )
    
    db.add(db_prediction)
    
    # Update user prediction count
    user.predictions_count += 1
    user.updated_at = __import__('datetime').datetime.utcnow()
    
    db.commit()
    db.refresh(db_prediction)
    
    return db_prediction


@router.get("/me", response_model=list[Prediction])
def get_my_predictions(db: Session = Depends(get_db)):
    """Get current user's predictions"""
    # TODO: Get user_id from JWT token
    user = db.query(UserModel).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    predictions = db.query(PredictionModel).filter(
        PredictionModel.user_id == user.id
    ).order_by(PredictionModel.created_at.desc()).all()
    
    return predictions


@router.get("/user/{user_id}", response_model=list[Prediction])
def get_user_predictions(user_id: str, db: Session = Depends(get_db)):
    """Get predictions for a specific user"""
    predictions = db.query(PredictionModel).filter(
        PredictionModel.user_id == user_id
    ).order_by(PredictionModel.created_at.desc()).all()
    
    return predictions


@router.get("/match/{match_id}", response_model=list[Prediction])
def get_match_predictions(match_id: str, db: Session = Depends(get_db)):
    """Get all predictions for a specific match"""
    predictions = db.query(PredictionModel).filter(
        PredictionModel.match_id == match_id
    ).all()
    
    return predictions
