# Deployment Log — April 3, 2026

## What Happened Today

Migrated the entire Betty Predictor stack away from Firebase/Render/Netlify to a simpler, fully free setup. The Render free trial had expired, Netlify hit its bandwidth limit, and Firebase was unnecessary complexity. We now run on Surge (static hosting) + Cloudflare Workers (backend API + D1 database).

### Key decisions made:
- **No VPS needed** — the app is lightweight enough for free-tier serverless
- **No Firebase** — SQLite (via Cloudflare D1) is fine, no need to rewrite for Firestore
- **Cloudflare over Render** — Render trial expired; Cloudflare Workers free tier has no expiry
- **Surge over Netlify** — Netlify bandwidth exceeded; Surge has no bandwidth limits on free tier
- **Backend rewritten from Python to JS** — Cloudflare Workers don't support Python/SQLAlchemy, so the FastAPI backend was ported to a vanilla JS Cloudflare Worker with D1 (SQLite-compatible) database

---

## Live URLs

| Component | URL | Platform | Status |
|-----------|-----|----------|--------|
| **Landing site** | https://betty-predictor.surge.sh | Surge | Live |
| **TG Mini App** | https://betty-tg-app.surge.sh | Surge | Live |
| **Backend API** | https://betty-api.mihel-klimm.workers.dev | Cloudflare Workers | Live |
| **Database** | D1 `betty-db` | Cloudflare D1 | Live |
| **Telegram Bot** | @betty_worldcup2026_bot | Telegram | Active |
| **GitHub repo** | github.com/MihelKlimm/betty-predictor | GitHub | Up to date |

### Dead/expired URLs (do not use):
- `legendary-jelly-66624f.netlify.app` — Netlify bandwidth exceeded
- `betty-tg-app.netlify.app` — Netlify bandwidth exceeded
- `betty-predictor-1.onrender.com` — Render trial expired

---

## Architecture

```
User opens Telegram → @betty_worldcup2026_bot
  → Bot menu button loads: https://betty-tg-app.surge.sh
    → React SPA with 3 tabs: Champions | Matches | Leaderboard
    → Predictions stored in localStorage (not yet synced to backend)
    → Leaderboard/Champions data fetched from API

Landing site: https://betty-predictor.surge.sh
  → Static HTML with 5 sections: Home | Champions | Matches | Leaderboard | About
  → Leaderboard/Champions data fetched from API

API: https://betty-api.mihel-klimm.workers.dev
  → Cloudflare Worker (JavaScript, ES modules)
  → Reads/writes Cloudflare D1 database (betty-db)
  → All endpoints from original FastAPI backend are ported
```

---

## TG Mini App Structure

The app opens directly to the **Matches** tab (prediction cards). No landing/start screen.

### 3 Navigation Tabs:

| Tab | Purpose | Data source |
|-----|---------|-------------|
| **Champions** | Last round results: player / correct results / correct scores / total points | API `GET /api/leaderboard` |
| **Matches** (default) | 10 prediction cards for Week 1 — pick outcome (1/X/2) + exact score | localStorage `betty_predictions_v2` |
| **Leaderboard** | TON distribution history: player / rounds played / TON won | API `GET /api/leaderboard` |

### Match Prediction Cards:
- 10 cards shown one at a time (prev/next navigation + dot indicators)
- Each card shows: team card images, team names, group, date, venue
- 3 outcome buttons: WIN 1 / DRAW / WIN 2
- Score grid: all scores from 0:0 to 9:0 where total goals <= 9
- Auto-save to localStorage when both outcome + score selected
- Auto-advance to next card after 600ms
- Progress bar shows completion

### After all 10 predictions:
Shows message: "All bets are in! Results will be available on June 18."

### Team card images (20 teams, all done):
MEX, SAF, CAN, BIH, USA, PAR, BRA, MOR, GER, CUR, NED, JAP, FRA, ALG, ARG, SEN, ENG, CRO, ESP, CVE

Images stored in: `frontend/public/teams/Cards/{CODE}.png`
Image registry: `frontend/src/data/matches.ts` → `TEAM_CARDS` object
Source: Google Drive folder `1sjPxdO9gP3wGili0BCBycmsxr9zGYlUt`

---

## Landing Site Structure

Single `index.html` file (no React, pure HTML/CSS/JS). Betty branding: yellow `#ffd90f` on dark `#1f1c09`.

| Section | Content | Data |
|---------|---------|------|
| **Home** | Betty logo, "Betty Predictor", slogan, Launch in Telegram CTA, stats (48 matches, 10/week, player count) | Static + API player count |
| **Champions** | Table: # / Player / Results / Scores / Applied / Rank | API `GET /api/leaderboard` |
| **Matches** | 10 Week 1 match cards: date, time, teams, venue, group | Hardcoded from Google Sheet |
| **Leaderboard** | Table: # / Player / Rounds / TON Won | API `GET /api/leaderboard` |
| **About** | Rules: sniff result = +1pt, sniff score = +3pts, weekly rankings, TON rewards, deadlines, fair play | Static |

---

## Backend API

**Runtime:** Cloudflare Worker (JavaScript ES modules)
**Database:** Cloudflare D1 (SQLite-compatible, edge-deployed)
**Code:** `cf-worker/src/worker.js`

### Endpoints:

| Method | Path | Purpose | Status |
|--------|------|---------|--------|
| GET | `/health` | Health check | Working |
| POST | `/api/user/register` | Register new user (tg_id, username) | Deployed |
| GET | `/api/user/me` | Get current user (by Bearer token = tg_id) | Deployed |
| GET | `/api/user/{id}` | Get user by ID | Deployed |
| GET | `/api/matches/active` | Get upcoming/live matches | Deployed |
| GET | `/api/matches` | Get all matches | Deployed |
| GET | `/api/matches/{id}` | Get match by ID | Deployed |
| POST | `/api/predictions` | Create prediction (match_id, prediction_type, predicted_score) | Deployed |
| GET | `/api/predictions/me` | Get current user's predictions | Deployed |
| GET | `/api/predictions/user/{id}` | Get user's predictions | Deployed |
| GET | `/api/predictions/match/{id}` | Get predictions for a match | Deployed |
| GET | `/api/leaderboard` | Get leaderboard (calculates from predictions vs finished matches) | Working |
| GET | `/api/leaderboard/overall` | Same as above | Working |
| GET | `/api/rewards/{userId}` | Get user's rewards | Deployed |
| POST | `/api/rewards/claim` | Claim pending TON rewards | Deployed |
| POST | `/api/telegram/web-app-data` | Validate Telegram initData | Deployed |
| GET | `/api/telegram/bot-info` | Get bot info | Deployed |

### Scoring logic (in leaderboard endpoint):
- Correct 1X2 prediction only: **1 point**
- Correct exact score (includes outcome): **3 points** (total, not added to 1)
- Only counts finished matches

### Database tables (D1):
- `users` — id, tg_id, username, is_premium, points, predictions_count, timestamps
- `matches` — id, home_team, away_team, date, time, round, status, scores, timestamps
- `predictions` — id, user_id, match_id, prediction_type, predicted_score (JSON), points_earned, timestamps
- `rewards` — id, user_id, week, points, ton_amount, status (pending/claimed), timestamps

Schema file: `cf-worker/schema.sql`

---

## Betting Rules (Important)

- Betting closes at the **exact kickoff time** of each individual match
- Each match has its own deadline — not a blanket cutoff
- If a player misses even 1 minute past kickoff, they miss that match
- Players can still predict later matches even if they missed earlier ones
- Once submitted, predictions are **locked at kickoff** — no edits after
- Must be enforced in both frontend (UI lock) and backend (reject late POST)
- **Not yet implemented** — needs exact kickoff timestamps added to match data

---

## File Map

| Path | Purpose |
|------|---------|
| `index.html` | Landing site (5-section, pure HTML/CSS/JS) |
| `frontend/src/App.tsx` | TG Mini App entry — 3 tabs, opens to Matches |
| `frontend/src/components/Navigation.tsx` | Bottom nav: Champions / Matches / Leaderboard |
| `frontend/src/pages/MainPage.tsx` | Prediction cards with score grid |
| `frontend/src/pages/ChampionsPage.tsx` | Last round results table |
| `frontend/src/pages/LeaderboardPage.tsx` | TON distribution history |
| `frontend/src/data/matches.ts` | Week 1 match data + TEAM_CARDS registry + score grid |
| `frontend/src/services/api.ts` | Axios API client (base URL from VITE_API_URL) |
| `frontend/public/teams/Cards/*.png` | 20 team card images |
| `cf-worker/src/worker.js` | Backend API (Cloudflare Worker) |
| `cf-worker/schema.sql` | D1 database schema |
| `cf-worker/wrangler.toml` | Worker config with D1 binding |
| `backend/` | Original Python/FastAPI backend (not deployed, reference only) |
| `deploy/` | VPS/Fly.io deploy configs (not used, historical) |

---

## How to Deploy (Restore Instructions)

### Prerequisites
- Node.js 18+ (use nvm: `nvm use 20`)
- Surge CLI authenticated (`mihel.klimm@gmail.com`, credentials in `~/.netrc`)
- GitHub authenticated (`gh auth login` as MihelKlimm)
- Cloudflare API token with Workers + D1 permissions

### Deploy Landing Site

```bash
cd /tmp && mkdir -p betty-site
cp ~/Ilya/index.html betty-site/
cp ~/Ilya/frontend/public/betty-logo.png betty-site/
cd betty-site
npx surge . betty-predictor.surge.sh
```

### Deploy TG Mini App

```bash
cd ~/Ilya/frontend
VITE_API_URL=https://betty-api.mihel-klimm.workers.dev npm run build
cd dist
cp index.html 200.html    # SPA fallback for Surge
npx surge . betty-tg-app.surge.sh
```

### Deploy Backend API

```bash
export CLOUDFLARE_API_TOKEN="<betty-deploy token>"
ACCOUNT_ID="aa87cd3c89231449d59081e1b27e5e88"

cat > /tmp/metadata.json << 'EOF'
{
  "main_module": "worker.js",
  "compatibility_date": "2024-12-01",
  "bindings": [{
    "type": "d1",
    "name": "DB",
    "id": "a064b461-a310-484e-80de-66a684e71c7c"
  }]
}
EOF

cd ~/Ilya/cf-worker
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/betty-api" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "metadata=@/tmp/metadata.json;type=application/json" \
  -F "worker.js=@src/worker.js;type=application/javascript+module"
```

Note: `wrangler` CLI doesn't work — token is missing `User → Memberships → Read` permission. Use the REST API above.

### Restore D1 Database Schema

```bash
export CLOUDFLARE_API_TOKEN="<betty-deploy token>"
ACCOUNT_ID="aa87cd3c89231449d59081e1b27e5e88"
DB_ID="a064b461-a310-484e-80de-66a684e71c7c"

curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/d1/database/$DB_ID/query" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$(cat cf-worker/schema.sql | tr '\n' ' ')\"}"
```

---

## Credentials

| Service | Credential | Notes |
|---------|-----------|-------|
| Cloudflare Account ID | `aa87cd3c89231449d59081e1b27e5e88` | Used in all CF API calls |
| Cloudflare API Token | `betty-deploy` token | Create/manage at dash.cloudflare.com/profile/api-tokens. Needs Workers Scripts Edit + D1 Edit. |
| D1 Database ID | `a064b461-a310-484e-80de-66a684e71c7c` | Database name: `betty-db`, region: EEUR |
| Workers subdomain | `mihel-klimm.workers.dev` | Auto-created, permanent |
| Surge | `mihel.klimm@gmail.com` | Auto-auth from `~/.netrc` |
| GitHub | `MihelKlimm` | Auth via `gh` CLI |
| Telegram Bot Token | In `backend/.env` (gitignored) | Bot: @betty_worldcup2026_bot |
| Google Sheet (matches) | `1h51r7hnqrzKrLdarypIyrTWS4zRkFL-UGQSrSUwMGus` | Week 1 schedule source |
| Google Drive (team cards) | Folder `1sjPxdO9gP3wGili0BCBycmsxr9zGYlUt` | All 20 team card PNGs |

## Free Tier Limits

| Service | Limit | Enough? |
|---------|-------|---------|
| Cloudflare Workers | 100K requests/day, 10ms CPU | Yes, for hundreds of users |
| Cloudflare D1 | 5M reads/day, 100K writes/day, 5GB storage | Yes |
| Surge | No bandwidth limit on free tier | Yes |

---

## Today's Commits

```
8d3c6dc Restructure tabs: Champions (last round), Matches (default), Leaderboard (TON history)
c8af487 Add completion message after all 10 predictions are made
48cd512 Enable card images for FRA, ALG, ARG, SEN, ENG, CRO, ESP, CVE
502d582 Add team card images: FRA, ALG, ARG, SEN, ENG, CRO, ESP, CVE
3de1036 Finalize v0.2.0-dev: deployment doc with full restore instructions
88b19cc Rebuild landing page with 5-section navigation: Home, Champions, Matches, Leaderboard, About
4992a7c Deploy backend to Cloudflare Workers + D1 database
efc168b Add Cloudflare Workers deployment plan for Apr 3
e6ef603 Add Render build config for Python backend
```

## Git Tag

`v0.2.0-dev` — tagged at commit `3de1036` (before tab restructure and team cards). To get the latest, use `main`.

---

## Known Issues

1. **Predictions are localStorage-only** — not synced to backend. If user clears browser data, predictions are lost.
2. **Kickoff deadline not enforced** — no lockout mechanism yet. Need exact timestamps per match.
3. **D1 database is empty** — no matches seeded, no users registered. Leaderboard returns `[]`.
4. **wrangler CLI broken** — Cloudflare token missing Memberships:Read. Must deploy via REST API.
5. **BotFather URL may need updating** — should point to `https://betty-tg-app.surge.sh`

## TODO (Next Session)

- [ ] Implement per-match kickoff deadline lockout (frontend + backend)
- [ ] Add exact kickoff timestamps to match data (with timezone)
- [ ] Seed Week 1 matches into D1 database
- [ ] Wire predictions from localStorage to backend API
- [ ] Update BotFather menu button URL to `betty-tg-app.surge.sh` (if not done)
- [ ] Test full flow in Telegram: open bot → predict → check leaderboard
- [ ] Buy custom domain and point to Surge / Cloudflare
