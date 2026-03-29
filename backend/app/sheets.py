import gspread
import logging
from typing import Optional
from datetime import datetime
from app.config import get_settings

logger = logging.getLogger(__name__)


class GoogleSheetsManager:
    """Manager for Google Sheets operations"""
    
    def __init__(self):
        self.settings = get_settings()
        self.client = None
        self.spreadsheet = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Google Sheets connection"""
        try:
            # For production, use OAuth2
            # For now, using service account credentials
            self.client = gspread.service_account(
                filename=self.settings.google_sheets_credentials
            )
            self.spreadsheet = self.client.open_by_key(self.settings.google_sheets_id)
            logger.info("Google Sheets initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing Google Sheets: {str(e)}")
            self.client = None
            self.spreadsheet = None
    
    def get_matches(self) -> list[dict]:
        """Get all matches from Google Sheets"""
        if not self.spreadsheet:
            return []
        
        try:
            worksheet = self.spreadsheet.worksheet("Matches")
            data = worksheet.get_all_records()
            return data
        except Exception as e:
            logger.error(f"Error getting matches: {str(e)}")
            return []
    
    def get_scores(self) -> dict[str, dict]:
        """Get match scores from Google Sheets"""
        if not self.spreadsheet:
            return {}
        
        try:
            worksheet = self.spreadsheet.worksheet("Scores")
            data = worksheet.get_all_records()
            scores = {}
            for row in data:
                match_id = row.get("match_id")
                if match_id:
                    scores[match_id] = {
                        "home_score": row.get("home_score"),
                        "away_score": row.get("away_score"),
                        "status": row.get("status", "finished"),
                        "updated_at": row.get("updated_at")
                    }
            return scores
        except Exception as e:
            logger.error(f"Error getting scores: {str(e)}")
            return {}
    
    def update_match_scores(self, match_id: str, home_score: int, away_score: int) -> bool:
        """Update match scores in Google Sheets"""
        if not self.spreadsheet:
            return False
        
        try:
            worksheet = self.spreadsheet.worksheet("Scores")
            # Find the row with this match_id and update
            cell_list = worksheet.findall(match_id)
            if cell_list:
                row = cell_list[0].row
                worksheet.update_cell(row, 2, home_score)  # Column B
                worksheet.update_cell(row, 3, away_score)  # Column C
                worksheet.update_cell(row, 4, "finished")  # Column D - status
                worksheet.update_cell(row, 5, datetime.now().isoformat())  # Column E - updated_at
                return True
            return False
        except Exception as e:
            logger.error(f"Error updating match scores: {str(e)}")
            return False
    
    def get_leaderboard_data(self) -> list[dict]:
        """Get leaderboard data from Google Sheets"""
        if not self.spreadsheet:
            return []
        
        try:
            worksheet = self.spreadsheet.worksheet("Leaderboard")
            data = worksheet.get_all_records()
            return data
        except Exception as e:
            logger.error(f"Error getting leaderboard data: {str(e)}")
            return []


def get_sheets_manager() -> GoogleSheetsManager:
    """Get Google Sheets manager instance"""
    return GoogleSheetsManager()
