# Implementation Roadmap & Next Steps

## Project Status: ✅ Phase 1 Complete - Foundation Built

This document outlines the completed work and the specific steps needed to take Betty from development to production.

---

## ✅ COMPLETED: Core Infrastructure

### Frontend (React + Telegram WebApp)
- [x] Project structure with Vite
- [x] TypeScript configuration
- [x] Zustand store for state management
- [x] API service layer with axios
- [x] Telegram Mini App integration hooks
- [x] Responsive CSS styling
- [x] Components:
  - App layout with navigation
  - Match cards with prediction interface
  - Leaderboard page
  - Score prediction inputs
- [x] Pages:
  - Main page (matches & predictions)
  - Leaderboard page
  - Profile page structure

### Backend (FastAPI + Python)
- [x] FastAPI application setup
- [x] SQLAlchemy database models
- [x] SQLite database
- [x] CORS middleware
- [x] API endpoints:
  - User registration & profile
  - Matches (CRUD, active, sync)
  - Predictions (create, retrieve)
  - Leaderboard calculation
  - Rewards management
  - TON integration endpoints
  - Telegram Mini App verification
- [x] Google Sheets integration module
- [x] TON wallet manager

### Deployment
- [x] Docker configuration (backend & frontend)
- [x] Docker Compose for local development
- [x] Setup & installation guide
- [x] Quick start scripts
- [x] GitHub Actions CI/CD workflows
- [x] Contributing guidelines

---

## 🚀 IMMEDIATE NEXT STEPS (CRITICAL)

### Step 1: Set Up Credentials (5-10 minutes)

1. **Create Google Service Account**
   ```bash
   1. Visit: https://console.cloud.google.com/
   2. Create new project: "Betty"
   3. Enable APIs:
      - Google Sheets API
      - Google Drive API
   4. Create Service Account:
      - Service Accounts → Create Service Account
      - Name: "betty-app"
      - Grant role: "Editor"
   5. Create JSON key:
      - Keys → Add Key → Create new key → JSON
      - Download and save as `credentials.json` in project root
   ```

2. **Create Google Sheets**
   ```
   1. Create new Google Sheet: https://sheets.google.com
   2. Name it: "Betty World Cup 2026"
   3. Add these tabs:
      - Matches
      - Scores
      - Leaderboard
   4. Share sheet with service account email
   5. Copy Sheet ID from URL
   6. Save to backend/.env as GOOGLE_SHEETS_ID=...
   ```

3. **Create Telegram Bot**
   ```
   1. Message @BotFather: https://t.me/botfather
   2. Type: /newbot
   3. Name: Betty World Cup
   4. Username: @betty_wc_bot (or similar)
   5. Copy token to backend/.env as TELEGRAM_BOT_TOKEN=...
   ```

### Step 2: Configure Environment Files (5 minutes)

**Backend** (`backend/.env`):
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SHEETS_CREDENTIALS=credentials.json
DATABASE_URL=sqlite:///./betty.db
TWA_APP_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
ADMIN_TELE_ID=your_telegram_id
```

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:8000
VITE_BOT_TOKEN=your_bot_token_here
VITE_APP_URL=http://localhost:5173
```

### Step 3: Run Locally (5-10 minutes)

**Option A: Quick Start Script**
```bash
# Linux/Mac
bash quickstart.sh

# Windows
quickstart.bat
```

**Option B: Manual Setup**
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Access at: `http://localhost:5173`

### Step 4: Test Locally (10 minutes)

1. **Test Backend API**
   - Visit: `http://localhost:8000/docs`
   - Try: `POST /api/user/register` with test data
   - Check: `GET /api/matches/active`

2. **Test Frontend**
   - Visit: `http://localhost:5173`
   - You should see Betty interface
   - Try creating a prediction (after backend user created)

3. **Test Google Sheets Sync**
   - Add test matches to Google Sheet "Matches" tab
   - Call: `http://localhost:8000/api/matches/sync`
   - Check backend logs and database

---

## 📋 NEXT PHASES

### Phase 2: Enhanced Features (Week 1-2)

- [ ] **Authentication**
  - Implement JWT token verification
  - Telegram WebApp data signature verification
  - User session management

- [ ] **Database**
  - Switch from SQLite to PostgreSQL for production
  - Add database migrations with Alembic
  - Add indexes for performance

- [ ] **Testing**
  - Write unit tests for backend API endpoints
  - Write integration tests for Google Sheets
  - Write React component tests
  - Aim for 80%+ coverage

- [ ] **Error Handling**
  - Better error messages
  - Graceful fallbacks
  - User-friendly error UI

### Phase 3: Production Deployment (Week 2-3)

- [ ] **Backend Deployment**
  - Deploy to Heroku / Railway / Render
  - Set up PostgreSQL database
  - Configure production environment variables
  - Set up logging & monitoring

- [ ] **Frontend Deployment**
  - Deploy to Vercel / Netlify
  - Configure custom domain
  - Set up HTTPS
  - Configure API endpoint for production

- [ ] **Telegram Bot Setup**
  - Register bot with Telegram
  - Set default web app URL
  - Configure inline button
  - Test end-to-end flow

### Phase 4: TON Integration (Week 3-4)

- [ ] **Connect TON Mainnet**
  - Use TON Center API
  - Implement wallet verification
  - Create TON transfer functions

- [ ] **Reward Distribution**
  - Implement weekly calculations
  - Create reward claiming UI
  - Test TON transfers

- [ ] **Wallet UI**
  - Add wallet connection interface
  - Display TON balance
  - Show reward history

### Phase 5: Polish & Launch (Week 4+)

- [ ] **User Experience**
  - Add animations
  - Improve loading states
  - Better mobile experience
  - Accessibility improvements

- [ ] **Admin Tools**
  - Admin dashboard
  - Manual score updates
  - Ban/moderate users
  - View analytics

- [ ] **Documentation**
  - User guide
  - API documentation
  - Architecture diagrams
  - Performance optimization guide

---

## 🛠️ CRITICAL FIXES & IMPROVEMENTS NEEDED

### High Priority (Do First)

1. **User Authentication**
   ```python
   # backend/app/auth.py needs to be created
   - JWT token generation
   - Token verification middleware
   - User verification from Telegram WebApp
   ```

2. **Database Improvements**
   - Add foreign key constraints
   - Add database migrations
   - Add data validation

3. **Error Handling**
   - Try-catch blocks in API endpoints
   - Proper HTTP error codes
   - User-friendly error messages

### Medium Priority (Do Soon)

1. **Testing**
   - Create `backend/tests/` directory
   - Create `frontend/src/__tests__/` directory
   - Aim for 80%+ coverage

2. **Performance**
   - Add database indexes
   - Add caching for leaderboard
   - Optimize API queries

3. **Frontend Improvements**
   - Add loading skeletons
   - Better error boundaries
   - Dark mode support

### Low Priority (Nice to Have)

1. **Additional Features**
   - User profiles
   - Prediction history
   - Statistics page
   - Social sharing

---

## 📊 DATABASE SCHEMA

Current tables created automatically:

```
users (id, tg_id, first_name, last_name, username, is_premium, points, predictions_count, created_at, updated_at)
matches (id, home_team, away_team, date, time, round, status, home_score, away_score, created_at, updated_at)
predictions (id, user_id, match_id, prediction_type, predicted_score, points_earned, created_at, updated_at)
rewards (id, user_id, week, points, ton_amount, status, claimed_at, created_at, updated_at)
```

---

## 🚢 DEPLOYMENT CHECKLIST

Before going live to production:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Error logging set up (Sentry/Datadog)
- [ ] Performance monitoring enabled
- [ ] HTTPS/SSL configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Database migrations tested
- [ ] Backup & disaster recovery plan
- [ ] User documentation complete
- [ ] Admin tools working
- [ ] security audit completed

---

## 🐛 KNOWN ISSUES & WORKAROUNDS

1. **JWT Authentication Not Implemented**
   - Currently uses first user from DB as fallback
   - Need to implement proper JWT verification

2. **Google Sheets Manual Updates**
   - Currently requires manual sync endpoint call
   - Should implement webhooks or Apps Script

3. **SQLite for Production**
   - Using SQLite which isn't suitable for production
   - Switch to PostgreSQL before going live

4. **TON Integration Placeholder**
   - Currently has mock implementation
   - Need to integrate actual TON SDK

---

## 📞 SUPPORT & RESOURCES

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **Telegram Mini Apps**: https://core.telegram.org/bots/webapps
- **TON Documentation**: https://ton.org/docs/
- **Google Sheets API**: https://developers.google.com/sheets/api

---

## Summary

You now have:
- ✅ Complete React frontend with Telegram integration
- ✅ Full FastAPI backend with all endpoints
- ✅ Google Sheets integration ready to use
- ✅ TON reward system structure
- ✅ Leaderboard calculation engine
- ✅ Docker setup for deploying
- ✅ GitHub Actions CI/CD workflows

**Next immediate action**: Set up credentials (.env files, Google Sheets, Telegram bot) and run locally to verify everything works!
