#!/bin/bash
set -euo pipefail

# ============================================
# Betty Predictor — VPS Deployment Script
# ============================================
# Usage: ssh user@your-vps "bash -s" < deploy.sh
# Or:    scp -r . user@your-vps:/tmp/betty && ssh user@your-vps "cd /tmp/betty/deploy && bash deploy.sh"
#
# Prerequisites on VPS:
#   - Ubuntu 22.04+ or Debian 12+
#   - Root or sudo access
#   - Domain DNS A-record pointing to this server's IP

DOMAIN="${1:-betty.app}"   # Pass your domain as first argument
APP_DIR="/opt/betty"
FRONTEND_DIR="/var/www/betty/frontend"

echo "==> Deploying Betty to $DOMAIN"

# --- 1. Install system dependencies ---
echo "==> Installing system packages..."
sudo apt-get update -qq
sudo apt-get install -y python3 python3-venv python3-pip curl debian-keyring debian-archive-keyring apt-transport-https

# --- 2. Install Caddy ---
if ! command -v caddy &>/dev/null; then
    echo "==> Installing Caddy..."
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt-get update -qq
    sudo apt-get install -y caddy
fi

# --- 3. Create app user ---
if ! id "betty" &>/dev/null; then
    echo "==> Creating betty user..."
    sudo useradd --system --no-create-home --shell /bin/false betty
fi

# --- 4. Set up backend ---
echo "==> Setting up backend..."
sudo mkdir -p "$APP_DIR/backend"
sudo cp -r ../backend/app "$APP_DIR/backend/"
sudo cp ../backend/requirements.txt "$APP_DIR/backend/"
sudo cp ../backend/.env "$APP_DIR/backend/"

# Create venv and install deps
sudo python3 -m venv "$APP_DIR/backend/venv"
sudo "$APP_DIR/backend/venv/bin/pip" install -q -r "$APP_DIR/backend/requirements.txt"

# Update .env for production
sudo sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$DOMAIN|" "$APP_DIR/backend/.env"
sudo sed -i "s|BACKEND_URL=.*|BACKEND_URL=https://$DOMAIN|" "$APP_DIR/backend/.env"
sudo sed -i "s|TWA_APP_URL=.*|TWA_APP_URL=https://$DOMAIN|" "$APP_DIR/backend/.env"

# Fix permissions
sudo chown -R betty:betty "$APP_DIR"

# --- 5. Build and deploy frontend ---
echo "==> Building frontend..."
cd ../frontend
npm ci --silent
VITE_API_URL="https://$DOMAIN" npm run build

echo "==> Deploying frontend..."
sudo mkdir -p "$FRONTEND_DIR"
sudo cp -r dist/* "$FRONTEND_DIR/"
sudo chown -R caddy:caddy "$FRONTEND_DIR"

# --- 6. Copy landing page ---
echo "==> Deploying landing page..."
sudo cp ../deploy/landing.html "$FRONTEND_DIR/landing.html"

# --- 7. Configure Caddy ---
echo "==> Configuring Caddy..."
sudo mkdir -p /var/log/caddy
# Replace domain placeholder in Caddyfile
sed "s/betty.app/$DOMAIN/g" ./Caddyfile | sudo tee /etc/caddy/Caddyfile > /dev/null

# --- 8. Install and start services ---
echo "==> Setting up systemd services..."
sed "s|betty.app|$DOMAIN|g" ./betty-api.service | sudo tee /etc/systemd/system/betty-api.service > /dev/null
sudo systemctl daemon-reload
sudo systemctl enable betty-api
sudo systemctl restart betty-api

echo "==> Starting Caddy..."
sudo systemctl enable caddy
sudo systemctl restart caddy

# --- 9. Verify ---
echo ""
echo "==> Waiting for services to start..."
sleep 3

if systemctl is-active --quiet betty-api; then
    echo "[OK] betty-api is running"
else
    echo "[FAIL] betty-api failed to start"
    sudo journalctl -u betty-api --no-pager -n 20
fi

if systemctl is-active --quiet caddy; then
    echo "[OK] caddy is running"
else
    echo "[FAIL] caddy failed to start"
    sudo journalctl -u caddy --no-pager -n 20
fi

echo ""
echo "============================================"
echo "Betty deployed!"
echo ""
echo "  Landing page:  https://$DOMAIN/landing.html"
echo "  Mini App:      https://$DOMAIN"
echo "  API health:    https://$DOMAIN/health"
echo ""
echo "Next steps:"
echo "  1. Set BotFather WebApp URL to: https://$DOMAIN"
echo "  2. Check logs:  sudo journalctl -u betty-api -f"
echo "  3. Check Caddy: sudo journalctl -u caddy -f"
echo "============================================"
