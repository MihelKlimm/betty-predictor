# Deployment Log — April 3, 2026

## Dev Version: `v0.2.0-dev` (tag: `v0.2.0-dev`)

To restore this exact state: `git checkout v0.2.0-dev`

---

## Live URLs

| Component | URL | Status |
|-----------|-----|--------|
| **Landing site** | https://betty-predictor.surge.sh | Live |
| **TG Mini App** | https://betty-tg-app.surge.sh | Live |
| **Backend API** | https://betty-api.mihel-klimm.workers.dev | Live |
| Telegram Bot | @betty_worldcup2026_bot | Active |
| GitHub | github.com/MihelKlimm/betty-predictor | Up to date |

Netlify sites (legendary-jelly-66624f, betty-tg-app.netlify.app) — **down**, free tier bandwidth exceeded.

## Architecture

```
Landing Site (betty-predictor.surge.sh)
  └── Fetches leaderboard from API

TG Mini App (betty-tg-app.surge.sh)
  ├── Predictions saved to localStorage
  └── Leaderboard fetched from API

Backend API (betty-api.mihel-klimm.workers.dev)
  └── Cloudflare D1 Database (betty-db)
```

## How to Restore if Something Breaks

### 1. Restore Landing Site

```bash
# From repo root
cd /tmp && mkdir betty-site
cp index.html betty-site/
cp frontend/public/betty-logo.png betty-site/
cd betty-site
npx surge . betty-predictor.surge.sh
```

Source file: `index.html` (repo root)

### 2. Restore TG Mini App

```bash
cd frontend
VITE_API_URL=https://betty-api.mihel-klimm.workers.dev npm run build
cd dist
npx surge . betty-tg-app.surge.sh
```

Source: `frontend/` directory. Requires Node.js 18+.

### 3. Restore Backend API (Cloudflare Worker)

**Option A: Via Cloudflare REST API (recommended)**

```bash
export CLOUDFLARE_API_TOKEN="<betty-deploy token>"
ACCOUNT_ID="aa87cd3c89231449d59081e1b27e5e88"

# Create metadata file
cat > /tmp/metadata.json << 'EOF'
{
  "main_module": "worker.js",
  "compatibility_date": "2024-12-01",
  "bindings": [
    {
      "type": "d1",
      "name": "DB",
      "id": "a064b461-a310-484e-80de-66a684e71c7c"
    }
  ]
}
EOF

# Deploy
cd cf-worker
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/betty-api" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "metadata=@/tmp/metadata.json;type=application/json" \
  -F "worker.js=@src/worker.js;type=application/javascript+module"
```

**Option B: Via wrangler (if token has Memberships:Read)**

```bash
export CLOUDFLARE_API_TOKEN="<betty-deploy token>"
cd cf-worker
npx wrangler deploy
```

### 4. Restore D1 Database Schema (if tables lost)

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

Schema file: `cf-worker/schema.sql`

### 5. Restore from Git Tag

```bash
git checkout v0.2.0-dev
# Then re-run any of the deploy steps above
```

---

## File Map

| File | Purpose |
|------|---------|
| `index.html` | Landing site (5 sections: Home, Champions, Matches, Leaderboard, About) |
| `frontend/` | TG Mini App (React + Vite) |
| `cf-worker/src/worker.js` | Backend API (Cloudflare Worker, JS) |
| `cf-worker/schema.sql` | D1 database schema (4 tables + indexes) |
| `cf-worker/wrangler.toml` | Worker config with D1 binding |
| `backend/` | Original FastAPI backend (Python, not deployed — reference only) |

## Landing Site Sections

| Section | Content | Data Source |
|---------|---------|-------------|
| Home | Betty logo, slogan, CTA, stats | Static + API player count |
| Champions | Player / Results / Scores / Applied / Rank | API `/api/leaderboard` |
| Matches | 10 Week 1 matches: date, time, teams, venue, group | Hardcoded (from Google Sheet) |
| Leaderboard | Player / Rounds Played / TON Won | API `/api/leaderboard` |
| About | Rules: result = +1pt, score = +3pts, weekly TON rewards | Static |

## Credentials Reference

| Service | Key | Where |
|---------|-----|-------|
| Cloudflare Account ID | `aa87cd3c89231449d59081e1b27e5e88` | All CF API calls |
| Cloudflare API Token | `betty-deploy` (create at dash.cloudflare.com/profile/api-tokens) | Worker + D1 deploys |
| D1 Database ID | `a064b461-a310-484e-80de-66a684e71c7c` | Worker binding + schema restore |
| Workers subdomain | `mihel-klimm.workers.dev` | Backend URL |
| Surge | mihel.klimm@gmail.com (auto from ~/.netrc) | Landing + TG app deploy |
| GitHub | MihelKlimm (via `gh` CLI) | Code push |
| Telegram Bot Token | In `backend/.env` (gitignored) | Bot config |
| Google Sheet ID | `1h51r7hnqrzKrLdarypIyrTWS4zRkFL-UGQSrSUwMGus` | Match schedule |

## Cloudflare Free Tier Limits

- Workers: 100K requests/day, 10ms CPU per request
- D1: 5M reads/day, 100K writes/day, 5GB storage
- No trial expiry

## Known Issues

- `wrangler` CLI fails on `/memberships` — token missing `User → Memberships → Read`. Use REST API instead.
- Netlify free tier bandwidth exceeded — sites migrated to Surge.
- TG app predictions are localStorage-only — not synced to backend yet.

## TODO (Next Session)

- [ ] Test full TG Mini App flow in Telegram
- [ ] Seed Week 1 matches into D1 database
- [ ] Wire TG app predictions to backend API (replace localStorage)
- [ ] Update BotFather menu button URL to `betty-tg-app.surge.sh`
- [ ] Add custom domain (when purchased)
