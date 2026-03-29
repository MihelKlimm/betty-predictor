# 🎮 BETTY - World Cup 2026 Predictions Mini App
## Complete Development Package Ready

This is a **production-ready codebase** for a Telegram Mini App that enables users to predict World Cup 2026 match outcomes and win TON rewards.

---

## 🚀 Quick Start (Choose One)

### Option 1: Automated Setup (Recommended)
```bash
# Linux/Mac
bash quickstart.sh

# Windows
quickstart.bat
```

### Option 2: Docker Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# (See "Get Credentials" section below)

# Start everything
docker-compose up -d

# Access at http://localhost
```

### Option 3: Manual Setup
See [SETUP.md](SETUP.md) for detailed instructions.

---

## 📋 Required Credentials (Get These First!)

### 1. Telegram Bot Token
1. Message [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow prompts
3. Copy the token
4. Add to `backend/.env`: `TELEGRAM_BOT_TOKEN=...`

### 2. Google Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable: Google Sheets API + Google Drive API
4. Create Service Account with Editor role
5. Create JSON key and download
6. Save as `credentials.json` in project root
7. Copy Sheet ID and add to `backend/.env`: `GOOGLE_SHEETS_ID=...`

### 3. Google Sheet (Template)
1. Create sheet at [Google Sheets](https://sheets.google.com)
2. Rename tabs to: `Matches`, `Scores`, `Leaderboard`
3. Add headers:
   - **Matches**: `id`, `home_team`, `away_team`, `date`, `time`, `round`, `status`
   - **Scores**: `match_id`, `home_score`, `away_score`, `status`, `updated_at`
4. Share with service account email
5. Add Sheet ID to `backend/.env`

---

## 🏗️ Project Structure

```
betty-predictor/
├── frontend/          # React Mini App
├── backend/           # FastAPI API
├── .github/           # CI/CD workflows
├── docker-compose.yml # Local dev environment
├── SETUP.md           # Detailed installation guide
└── IMPLEMENTATION.md  # Roadmap & next steps
```

---

## 💰 What Users Can Do

1. **Make Predictions**
   - Predict Home Win (1), Draw (X), or Away Win (2)
   - Optionally predict exact score
   - Earn points: 1 for correct prediction, 3 for correct score

2. **View Results**
   - See match updates in real-time
   - Track personal statistics
   - View weekly leaderboard

3. **Earn Rewards**
   - Top scorers earn TON tokens
   - Weekly payouts to winners
   - Claim directly to wallet

---

## 📊 How It Works

```
┌─────────────────┐
│  User (Telegram)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────────┐
│  Frontend React │◄──────┤  Backend FastAPI │
│   Telegram App  │       │    (Python)      │
└────────┬────────┘       └────────┬─────────┘
         │                         │
         │                         ▼
         │                ┌──────────────────┐
         │                │  Google Sheets   │
         │                │  (Fixtures,      │
         │                │   Scores, Data)  │
         │                └──────────────────┘
         │
         ▼
┌─────────────────┐
│ Leaderboard &   │
│ TON Rewards     │
└─────────────────┘
```

---

## 📱 Features Implemented

✅ **Frontend**
- React with TypeScript
- Telegram Mini App integration
- Responsive design
- Match prediction interface
- Leaderboard page
- Real-time updates
- Clean, modern UI

✅ **Backend**
- FastAPI REST API
- SQLAlchemy ORM
- Google Sheets integration
- Leaderboard calculations
- Reward management
- TON wallet structure
- Error handling

✅ **Infrastructure**
- Docker containerization
- Docker Compose for local dev
- GitHub Actions CI/CD
- Deployment scripts
- Environment configuration

---

## 🔑 API Endpoints

### Users
- `POST /api/user/register` - Register new user
- `GET /api/user/me` - Get current user
- `GET /api/user/{id}` - Get user by ID

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/active` - Get active/upcoming
- `POST /api/matches/sync` - Sync from Google Sheets

### Predictions
- `POST /api/predictions` - Make prediction
- `GET /api/predictions/me` - My predictions
- `GET /api/predictions/match/{id}` - Match predictions

### Leaderboard
- `GET /api/leaderboard` - Weekly leaderboard
- `GET /api/leaderboard/overall` - Overall ranking

### Rewards & TON
- `GET /api/rewards/{id}` - User rewards
- `POST /api/rewards/claim` - Claim TON
- `POST /api/ton/verify-wallet` - Add wallet

See [SETUP.md](SETUP.md) for full API documentation.

---

## 🧪 Testing Locally

After setup, test each part:

1. **API Health**
   ```bash
   curl http://localhost:8000/health
   ```

2. **API Docs**
   - Visit: http://localhost:8000/docs
   - Try endpoints in Swagger UI

3. **Frontend**
   - Visit: http://localhost:5173
   - Should see Betty interface

4. **Google Sheets Sync**
   ```bash
   curl -X POST http://localhost:8000/api/matches/sync
   ```

---

## 🚢 Deployment Options

### Development
- Use included `docker-compose.yml`
- Run `docker-compose up`

### Production
See [IMPLEMENTATION.md](IMPLEMENTATION.md) for:
- Database migration (SQLite → PostgreSQL)
- Deployment to cloud (Heroku, Railway, render)
- Setting up production environment variables
- Monitoring and logging
- TON mainnet integration

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Installation & configuration
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Roadmap & next steps
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[README.md](README.md)** - Project overview
- **API Docs** - http://localhost:8000/docs (when running)

---

## 🎯 Next Steps (in order)

1. **Get credentials** (Google + Telegram)
2. **Configure .env files** 
3. **Run locally** with quickstart script
4. **Test the app** (add test matches, make predictions)
5. **Review [IMPLEMENTATION.md](IMPLEMENTATION.md)** for production plan
6. **Deploy frontend** (Vercel/Netlify)
7. **Deploy backend** (Heroku/Railway)
8. **Set up Telegram bot** to point to deployed URL
9. **Test end-to-end** through Telegram

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Backend | FastAPI, Python 3.10+ |
| Database | SQLite (dev), PostgreSQL (prod) |
| Data | Google Sheets API |
| Rewards | TON blockchain |
| Deployment | Docker, GitHub Actions |

---

## ⚙️ System Requirements

- **Node.js**: 18+
- **Python**: 3.10+
- **Docker**: Optional but recommended
- **Google Account**: For Sheets & Service Account
- **Telegram Account**: For bot testing

---

## 📞 Support

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **Telegram Mini Apps**: https://core.telegram.org/bots/webapps
- **TON Docs**: https://ton.org/docs/
- **Google Sheets**: https://developers.google.com/sheets/api

---

## 📝 License

Proprietary - All rights reserved

---

## 🎉 You're Ready!

Everything is set up and ready to go. Follow the Quick Start above, get your credentials, and launch Betty! 

Questions? Check [SETUP.md](SETUP.md) or [IMPLEMENTATION.md](IMPLEMENTATION.md).

**Happy predicting! ⚽🌍💰**
