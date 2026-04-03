# Deployment Log — April 3, 2026

## Result

Backend successfully deployed to **Cloudflare Workers + D1**.

## Live URLs

| Component | URL | Status |
|-----------|-----|--------|
| Landing site | https://legendary-jelly-66624f.netlify.app | Live |
| TG Mini App | https://betty-tg-app.netlify.app | Live |
| Landing (alt) | https://betty-predictor.surge.sh | Live |
| **Backend API** | **https://betty-api.mihel-klimm.workers.dev** | **Live** |
| Telegram Bot | @betty_worldcup2026_bot | Active |
| GitHub | github.com/MihelKlimm/betty-predictor | Up to date |

## Architecture

```
Telegram Mini App (betty-tg-app.netlify.app)
  └── API calls → Cloudflare Worker (betty-api.mihel-klimm.workers.dev)
                    └── D1 Database (betty-db)
```

## What Was Done

### 1. Created D1 Database via Cloudflare API
- Database name: `betty-db`
- Database ID: `a064b461-a310-484e-80de-66a684e71c7c`
- Region: EEUR (Eastern Europe)
- Tables: `users`, `matches`, `predictions`, `rewards` + indexes

### 2. Deployed Worker via Cloudflare API
- Worker name: `betty-api`
- Subdomain: `mihel-klimm.workers.dev`
- Deployed using multipart upload API (wrangler CLI blocked by missing Memberships:Read permission)

### 3. API Endpoints Implemented

All endpoints from the original FastAPI backend are ported to the Cloudflare Worker:

| Method | Path | Status |
|--------|------|--------|
| GET | `/health` | Working |
| POST | `/api/user/register` | Deployed |
| GET | `/api/user/me` | Deployed |
| GET | `/api/user/{user_id}` | Deployed |
| GET | `/api/matches/active` | Deployed |
| GET | `/api/matches` | Deployed |
| GET | `/api/matches/{match_id}` | Deployed |
| POST | `/api/predictions` | Deployed |
| GET | `/api/predictions/me` | Deployed |
| GET | `/api/predictions/user/{user_id}` | Deployed |
| GET | `/api/predictions/match/{match_id}` | Deployed |
| GET | `/api/leaderboard` | Working (returns [] — no users yet) |
| GET | `/api/leaderboard/overall` | Working |
| GET | `/api/rewards/{user_id}` | Deployed |
| POST | `/api/rewards/claim` | Deployed |
| POST | `/api/telegram/web-app-data` | Deployed |
| GET | `/api/telegram/bot-info` | Deployed |

## Files Created

```
cf-worker/
├── wrangler.toml        # Cloudflare Worker config (D1 binding)
├── schema.sql           # Database schema (4 tables + indexes)
└── src/
    └── worker.js        # Full API — JS port of FastAPI backend
```

## Still TODO

- [ ] Rebuild TG Mini App frontend with `VITE_API_URL=https://betty-api.mihel-klimm.workers.dev`
- [ ] Redeploy frontend to Netlify (`betty-tg-app`)
- [ ] Test full flow in Telegram (register → predict → leaderboard)
- [ ] Seed matches from Google Sheet into D1 database

## Cloudflare Free Tier Limits

- Workers: 100K requests/day
- D1: 5M reads/day, 100K writes/day, 5GB storage
- No trial expiry — free forever

## Credentials

| Service | Detail |
|---------|--------|
| Cloudflare Account ID | `aa87cd3c89231449d59081e1b27e5e88` |
| Cloudflare API Token | `betty-deploy` token (Workers + D1 permissions) |
| D1 Database ID | `a064b461-a310-484e-80de-66a684e71c7c` |
| Workers subdomain | `mihel-klimm.workers.dev` |
| Netlify | CLI authenticated (mihel.klimm@gmail.com) |
| GitHub | CLI authenticated (MihelKlimm) |

## Notes

- `wrangler` CLI fails on `/memberships` endpoint — token missing `User → Memberships → Read` permission. Workaround: deploy via Cloudflare REST API directly (curl).
- To redeploy the worker, use the multipart upload API or fix the token permissions and use `npx wrangler deploy`.
