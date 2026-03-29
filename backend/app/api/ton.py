from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db, UserModel, RewardModel
from app.ton import get_ton_manager

router = APIRouter(tags=["ton"])


@router.post("/api/ton/verify-wallet")
def verify_wallet_address(wallet_address: str, db: Session = Depends(get_db)):
    """Verify and store user's TON wallet address"""
    # TODO: Get user_id from JWT token
    user = db.query(UserModel).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    ton_manager = get_ton_manager()
    if not ton_manager.validate_wallet_address(wallet_address):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid TON wallet address"
        )
    
    # Store wallet address (add to user model in real implementation)
    # For now, just verify
    return {
        "success": True,
        "wallet_address": wallet_address,
        "message": "Wallet verified"
    }


@router.post("/api/ton/claim-reward")
def claim_ton_reward(db: Session = Depends(get_db)):
    """Claim TON reward"""
    # TODO: Get user_id from JWT token
    user = db.query(UserModel).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Get pending rewards
    pending_rewards = db.query(RewardModel).filter(
        RewardModel.user_id == user.id,
        RewardModel.status == "pending"
    ).all()
    
    if not pending_rewards:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No pending rewards"
        )
    
    total_ton = sum(r.ton_amount for r in pending_rewards)
    
    ton_manager = get_ton_manager()
    # TODO: Get wallet address from user
    wallet_address = "EQA..."  # Placeholder
    
    tx_result = ton_manager.transfer_ton(wallet_address, total_ton)
    
    if tx_result["success"]:
        # Update reward status
        for reward in pending_rewards:
            reward.status = "claimed"
            reward.tx_hash = tx_result.get("tx_hash")
        
        db.commit()
        
        return {
            "success": True,
            "total_ton": total_ton,
            "tx_hash": tx_result.get("tx_hash"),
            "message": f"Claimed {total_ton} TON"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transfer failed: {tx_result.get('error')}"
        )


@router.get("/api/ton/claim-status/{tx_hash}")
def get_claim_status(tx_hash: str, db: Session = Depends(get_db)):
    """Get status of a TON claim transaction"""
    ton_manager = get_ton_manager()
    status_info = ton_manager.get_transaction_status(tx_hash)
    
    return status_info
