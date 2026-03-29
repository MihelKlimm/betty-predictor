# SETUP & DEPLOYMENT GUIDE

## Prerequisites

Before setting up Betty, make sure you have:

1. **Telegram Bot Token**
   - Create a bot with [@BotFather](https://t.me/botfather)
   - Copy the token and save it

2. **Google Sheets Setup**
   - Create a Google Sheet with the following sheets/tabs:
     - **Matches**: Contains World Cup 2026 fixtures
       - Columns: `id`, `home_team`, `away_team`, `date`, `time`, `round`, `status`
     - **Scores**: Contains match scores
       - Columns: `match_id`, `home_score`, `away_score`, `status`, `updated_at`
     - **Leaderboard**: For calculating rankings

3. **Google Service Account Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google Sheets API
   - Create a Service Account
   - Download the JSON credentials file
   - Save as `credentials.json` in the project root

4. **Node.js & Python**
   - Node.js 18+
   - Python 3.10+

5. **Docker (Optional)**
   - Docker & Docker Compose for containerized deployment

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/MihelKlimm/betty-predictor.git
cd betty-predictor
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env

# Edit .env with your values:
# - TELEGRAM_BOT_TOKEN=your_bot_token
# - GOOGLE_SHEETS_ID=your_sheets_id
# - admin info, etc.

# Run backend
python -m uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env.local

# Edit .env.local:
# VITE_API_URL=http://localhost:8000
# VITE_BOT_TOKEN=your_bot_token

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Copy environment variables
cp .env.example .env

# Edit .env with your configuration

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Both backend and frontend will be running:
- Frontend: `http://localhost`
- Backend: `http://localhost:8000`

### Building Images Separately

```bash
# Build backend
docker build -f Dockerfile.backend -t betty-backend .

# Build frontend
docker build -f Dockerfile.frontend -t betty-frontend .

# Run backend
docker run -p 8000:8000 --env-file .env betty-backend

# Run frontend
docker run -p 80:80 betty-frontend
```

---

## Telegram Mini App Setup

### 1. Configure Bot Command

In [@BotFather](https://t.me/botfather), set the bot's default Web App:

```
/mybotcommand
app - Open World Cup predictions app
```

Then set the Web App URL:
```
/setmenubutton
app
```

### 2. Deploy Your Frontend

The frontend needs to be deployed to a public URL. Options:

- **Vercel** (Recommended for React)
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**
  ```bash
  npm install -g netlify-cli
  netlify deploy --prod --dir frontend/dist
  ```

- **Your own server**
  - Build: `npm run build`
  - Deploy the `dist` folder

### 3. Update Environment Variables

Once deployed, update:
- Backend `.env`: `TWA_APP_URL=https://your-domain.com/app`
- Bot commands to point to your deployed URL

---

## Database Initialization

The database is automatically initialized when you first run the backend. Tables created:
- `users` - User profiles
- `matches` - Match fixtures
- `predictions` - User predictions
- `rewards` - TON rewards

To reset the database:
```bash
rm betty.db  # SQLite database
```

---

## Syncing Google Sheets Data

### Option 1: Manual Sync Endpoint

```bash
curl -X POST http://localhost:8000/api/matches/sync
```

### Option 2: Automated Sync (Cron Job)

Set up a cron job to periodically sync:
```bash
# Every 30 minutes
*/30 * * * * curl http://localhost:8000/api/matches/sync
```

### Option 3: Event-Driven

In Google Sheets, add a script that calls your sync endpoint when scores change.

---

## API Endpoints

### Users
- `POST /api/user/register` - Register new user
- `GET /api/user/me` - Get current user
- `GET /api/user/{user_id}` - Get user profile

### Matches
- `GET /api/matches/active` - Get active/upcoming matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/{match_id}` - Get match details
- `POST /api/matches/sync` - Sync from Google Sheets

### Predictions
- `POST /api/predictions` - Create prediction
- `GET /api/predictions/me` - Get my predictions
- `GET /api/predictions/user/{user_id}` - Get user's predictions
- `GET /api/predictions/match/{match_id}` - Get all predictions for match

### Leaderboard
- `GET /api/leaderboard` - Get weekly leaderboard
- `GET /api/leaderboard/overall` - Get overall leaderboard

### Rewards
- `GET /api/rewards/{user_id}` - Get user's rewards
- `POST /api/rewards/claim` - Claim pending rewards

### TON Integration
- `POST /api/ton/verify-wallet` - Verify TON wallet
- `POST /api/ton/claim-reward` - Claim TON reward
- `GET /api/ton/claim-status/{tx_hash}` - Get claim status

---

## Production Deployment

### Recommended: Docker Swarm or Kubernetes

```bash
# Initialize Docker Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml betty
```

### Key Production Considerations

1. **Database**: Switch from SQLite to PostgreSQL
   ```python
   # Update config.py
   DATABASE_URL = "postgresql://user:password@host/betty"
   ```

2. **Authentication**: Implement proper JWT token verification
   ```python
   # Use python-jose or PyJWT
   from jose import JWTError, jwt
   ```

3. **CORS**: Lock down allowed origins
   ```python
   # In config.py
   allowed_origins = ["https://your-domain.com"]
   ```

4. **Environment Variables**: Use secrets management
   - Docker Secrets
   - AWS Secrets Manager
   - HashiCorp Vault

5. **Monitoring**: Add logging and monitoring
   ```bash
   pip install python-json-logger
   pip install sentry-sdk
   ```

6. **SSL/TLS**: Use HTTPS
   - Nginx with Let's Encrypt
   - CDN (Cloudflare, AWS CloudFront)

---

## Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check logs
python -m uvicorn app.main:app --reload --log-level debug
```

### Google Sheets connection fails
- Verify `credentials.json` exists
- Check Google Cloud permissions
- Ensure service account has access to the sheet
- Verify `GOOGLE_SHEETS_ID` is correct

### Frontend doesn't connect to backend
- Check backend is running: `http://localhost:8000/health`
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors

### Telegram Mini App not loading
- Verify deployed URL is HTTPS
- Check bot token is correct
- Verify bot commands are set
- Check browser console for errors

---

## Support & Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Telegram Mini App Documentation](https://core.telegram.org/bots/webapps)
- [TON Documentation](https://ton.org/docs/)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

## License

Proprietary - All rights reserved
