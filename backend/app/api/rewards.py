from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db, RewardModel, UserModel

router = APIRouter(prefix="/api/rewards", tags=["rewards"])


@router.get("/{user_id}")
def get_user_rewards(user_id: str, db: Session = Depends(get_db)):
    """Get rewards for a user"""
    rewards = db.query(RewardModel).filter(RewardModel.user_id == user_id).all()
    
    total_points = sum(r.points for r in rewards)
    total_ton = sum(r.ton_amount for r in rewards if r.status == "claimed")
    pending_ton = sum(r.ton_amount for r in rewards if r.status == "pending")
    
    return {
        "user_id": user_id,
        "total_points": total_points,
        "claimed_ton": total_ton,
        "pending_ton": pending_ton,
        "rewards": rewards
    }


@router.post("/claim")
def claim_rewards(db: Session = Depends(get_db)):
    """Claim pending rewards (convert TON)"""
    # TODO: Get user_id from JWT token
    user = db.query(UserModel).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    pending_rewards = db.query(RewardModel).filter(
        RewardModel.user_id == user.id,
        RewardModel.status == "pending"
    ).all()
    
    if not pending_rewards:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No pending rewards to claim"
        )
    
    # Update reward status
    for reward in pending_rewards:
        reward.status = "claimed"
    
    db.commit()
    
    total_ton = sum(r.ton_amount for r in pending_rewards)
    return {
        "message": f"Claimed {total_ton} TON",
        "total_ton": total_ton
    }
