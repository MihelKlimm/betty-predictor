#!/bin/sh
set -e

# Start FastAPI in the background
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &

# Start Caddy in the foreground (routes traffic to FastAPI + serves frontend)
caddy run --config /etc/caddy/Caddyfile
