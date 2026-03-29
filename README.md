# BETTY - World Cup 2026 Prediction Telegram Mini App

A Telegram Mini App for World Cup 2026 predictions where users make 1X2 bets and predict scores to earn TON rewards.

## Project Overview

**Goal:** Enable users to predict World Cup 2026 match outcomes and scores through a Telegram Mini App.

**Core Features:**
- 📊 Predict 1X2 (Win1/Draw/Win2) and score for each match
- 🏆 Leaderboard system with weekly rankings
- 💰 TON token rewards for top performers
- 📱 Seamless Telegram Mini App integration
- 📈 Real-time score tracking from Google Sheets

**Scoring System:**
- Correct 1X2 prediction: 1 point
- Correct exact score: 3 points

## Tech Stack

- **Frontend:** React + Vite + Telegram WebApp SDK
- **Backend:** Python + FastAPI
- **Database:** Google Sheets (source of truth for schedules/scores)
- **Blockchain:** TON for rewards
- **Deployment:** TBD

## Project Structure

```
betty-predictor/
├── frontend/                 # React Mini App
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand state management
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── main.py
│   │   ├── api/             # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── config.py        # Configuration
│   │   └── sheets.py        # Google Sheets integration
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Telegram Bot Token
- Google Sheets API credentials
- TON wallet setup

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your environment variables
python -m uvicorn app.main:app --reload
```

## Environment Variables

### Backend (.env)
```
TELEGRAM_BOT_TOKEN=your_token_here
GOOGLE_SHEETS_CREDENTIALS=path_to_credentials.json
DATABASE_URL=sqlite:///./betty.db
TWA_APP_URL=your_twa_app_url
ADMIN_TELE_ID=your_admin_id
```

## API Endpoints

### Predictions
- `POST /api/predictions` - Create a prediction
- `GET /api/predictions/{user_id}` - Get user predictions
- `GET /api/predictions/active` - Get active predictions

### Leaderboard
- `GET /api/leaderboard` - Get weekly leaderboard
- `GET /api/leaderboard/{week}` - Get leaderboard for specific week

### Matches
- `GET /api/matches` - Get matches from Google Sheets
- `GET /api/matches/{id}` - Get match details and current score

### User
- `GET /api/user/me` - Get current user profile
- `POST /api/user/register` - Register new user

### Rewards
- `GET /api/rewards/{user_id}` - Get earned rewards
- `POST /api/rewards/claim` - Claim TON rewards

## Development Roadmap

1. **Phase 1:** Frontend setup + Telegram integration
2. **Phase 2:** Backend API development
3. **Phase 3:** Google Sheets integration
4. **Phase 4:** Leaderboard system
5. **Phase 5:** TON rewards integration
6. **Phase 6:** Testing & deployment

## Contributing

This is a private project developed as an AI agent task.

## License

Proprietary - All rights reserved
