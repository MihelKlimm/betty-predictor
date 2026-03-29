from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db, MatchModel
from app.models import Match, MatchCreate
from app.sheets import get_sheets_manager

router = APIRouter(prefix="/api/matches", tags=["matches"])


@router.get("/active", response_model=list[Match])
def get_active_matches(db: Session = Depends(get_db)):
    """Get active (upcoming and live) matches"""
    matches = db.query(MatchModel).filter(
        MatchModel.status.in_(["upcoming", "live"])
    ).order_by(MatchModel.date).all()
    return matches


@router.get("", response_model=list[Match])
def get_all_matches(db: Session = Depends(get_db)):
    """Get all matches"""
    matches = db.query(MatchModel).order_by(MatchModel.date).all()
    return matches


@router.get("/{match_id}", response_model=Match)
def get_match(match_id: str, db: Session = Depends(get_db)):
    """Get match by ID"""
    match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    return match


@router.post("/sync", response_model=dict)
def sync_matches_from_sheets(db: Session = Depends(get_db)):
    """Sync matches from Google Sheets"""
    try:
        sheets_manager = get_sheets_manager()
        matches_data = sheets_manager.get_matches()
        scores_data = sheets_manager.get_scores()
        
        count = 0
        for match_data in matches_data:
            # Create or update match
            db_match = db.query(MatchModel).filter(
                MatchModel.home_team == match_data.get("home_team"),
                MatchModel.away_team == match_data.get("away_team"),
                MatchModel.date == match_data.get("date")
            ).first()
            
            if not db_match:
                db_match = MatchModel(
                    home_team=match_data.get("home_team"),
                    away_team=match_data.get("away_team"),
                    date=match_data.get("date"),
                    time=match_data.get("time"),
                    round=match_data.get("round"),
                    status=match_data.get("status", "upcoming")
                )
                db.add(db_match)
            else:
                # Update status and scores
                if db_match.id in scores_data:
                    score_info = scores_data[db_match.id]
                    db_match.home_score = score_info.get("home_score")
                    db_match.away_score = score_info.get("away_score")
                    db_match.status = score_info.get("status", db_match.status)
            
            count += 1
        
        db.commit()
        return {"message": f"Synced {count} matches", "count": count}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error syncing matches: {str(e)}"
        )
