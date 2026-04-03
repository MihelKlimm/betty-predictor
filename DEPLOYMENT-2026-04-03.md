# Deployment Plan — April 3, 2026

## Goal

Deploy Betty Predictor backend to **Cloudflare Workers + D1** (free tier, no trial expiry).

## Current State

| Component | URL | Status |
|-----------|-----|--------|
| Landing site | https://legendary-jelly-66624f.netlify.app | Live |
| TG Mini App | https://betty-tg-app.netlify.app | Live |
| Telegram Bot | @betty_worldcup2026_bot | Active, menu button set |
| Landing (alt) | https://betty-predictor.surge.sh | Live |
| Backend API | **Not deployed** | Render free trial expired |
| GitHub | github.com/MihelKlimm/betty-predictor | Up to date |

## Why Cloudflare

- Render free trial expired
- Cloudflare Workers free tier: 100K requests/day, no expiry
- D1 database: SQLite-compatible, free tier 5M reads/day, 100K writes/day
- More than enough for a Telegram Mini App

## Architecture

```
Telegram Mini App (Netlify)
  └── API calls → Cloudflare Worker (betty-api.{account}.workers.dev)
                    └── D1 Database (betty-db, SQLite-compatible)
```

## What Needs to Be Done

### Step 1: Create D1 Database (in Cloudflare Dashboard)

1. Go to https://dash.cloudflare.com → Workers & Pages → D1 SQL Database
2. Click "Create" → name it `betty-db`
3. Copy the **Database ID**
4. Paste it into `cf-worker/wrangler.toml` (the `database_id` field)

### Step 2: Initialize Database Schema

Run after creating D1:
```bash
export CLOUDFLARE_API_TOKEN="cfat_XHuUlECvUbhdj5Bbx73D6BhbuBd4pqOUfU8TdWKKedd94ddf"
cd cf-worker
npx wrangler d1 execute betty-db --remote --file=schema.sql
```

Schema file (`cf-worker/schema.sql`) needs to be created with tables:
- `users` (id, tg_id, username, is_premium, points, predictions_count, created_at, updated_at)
- `matches` (id, home_team, away_team, date, time, round, status, home_score, away_score, created_at, updated_at)
- `predictions` (id, user_id, match_id, prediction_type, predicted_score, points_earned, created_at, updated_at)
- `rewards` (id, user_id, week, points, ton_amount, status, claimed_at, created_at, updated_at)

### Step 3: Deploy Worker

```bash
cd cf-worker
npx wrangler deploy
```

Worker code is at `cf-worker/src/worker.js` — a lightweight JS API that mirrors the FastAPI endpoints.

### Step 4: Update Frontend

Rebuild frontend with the Cloudflare Worker URL:
```bash
cd frontend
VITE_API_URL=https://betty-api.{account}.workers.dev npm run build
npx netlify deploy --dir=dist --prod
```

## API Endpoints to Implement

### Currently used by frontend:
- `GET /api/leaderboard?week={week}` — **only endpoint actually called**

### Defined but not yet called (predictions saved to localStorage):
- `POST /api/user/register`
- `GET /api/user/me`
- `GET /api/matches/active`
- `GET /api/matches`
- `POST /api/predictions`
- `GET /api/predictions/me`
- `GET /api/leaderboard/overall`
- `GET /api/rewards/{userId}`
- `POST /api/rewards/claim`
- `POST /api/telegram/web-app-data`

## Files Created (in repo)

```
cf-worker/
├── wrangler.toml        # Cloudflare Worker config (needs database_id)
└── src/
    └── worker.js        # To be created: API handler
```

## Credentials

| Service | Auth |
|---------|------|
| Cloudflare | API Token: `cfat_XHuU...` (betty-deploy token, needs Memberships:Read permission for CLI) |
| Cloudflare Account ID | `aa87cd3c89231449d59081e1b27e5e88` |
| Netlify | Authenticated via CLI (mihel.klimm@gmail.com) |
| GitHub | Authenticated via `gh` CLI (MihelKlimm) |
| ngrok | Auth token configured (for local dev tunneling) |

## Token Permission Issue

The current Cloudflare API token is missing **User → Memberships → Read** permission, which prevents `wrangler d1 create` from working via CLI. Two workarounds:
1. Edit the token at https://dash.cloudflare.com/profile/api-tokens and add Memberships:Read
2. Create the D1 database manually in the dashboard (recommended, faster)

## Next Session Checklist

- [ ] Create D1 database in Cloudflare dashboard
- [ ] Paste database_id into wrangler.toml
- [ ] Create schema.sql and initialize tables
- [ ] Write worker.js with all API endpoints
- [ ] Deploy worker
- [ ] Rebuild frontend with worker URL
- [ ] Redeploy frontend to Netlify
- [ ] Test in Telegram
