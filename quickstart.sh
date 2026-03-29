#!/bin/bash

# Betty Quick Start Script

echo "🎮 Betty - World Cup 2026 Predictions Setup"
echo "============================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Python and Node.js found"
echo ""

# Backend setup
echo "🔧 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

pip install -r requirements.txt

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env file - please edit with your credentials"
fi

cd ..
echo "✅ Backend setup complete"
echo ""

# Frontend setup
echo "🎨 Setting up frontend..."
cd frontend

npm install

if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "⚠️  Created .env.local file - please edit with your credentials"
fi

cd ..
echo "✅ Frontend setup complete"
echo ""

echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your Telegram bot token and Google Sheets ID"
echo "2. Edit frontend/.env.local with your API URL"
echo "3. Run: cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload"
echo "4. In another terminal: cd frontend && npm run dev"
echo ""
echo "Access the app at: http://localhost:5173"
echo "API docs at: http://localhost:8000/docs"
