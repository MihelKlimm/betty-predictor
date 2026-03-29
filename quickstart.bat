@echo off
REM Betty Quick Start Script for Windows

echo 🎮 Betty - World Cup 2026 Predictions Setup
echo ============================================
echo.

REM Check prerequisites
echo 📋 Checking prerequisites...

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python 3.10+
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 18+
    exit /b 1
)

echo ✅ Python and Node.js found
echo.

REM Backend setup
echo 🔧 Setting up backend...
cd backend

if not exist "venv" (
    python -m venv venv
)

call venv\Scripts\activate.bat

pip install -r requirements.txt

if not exist ".env" (
    copy .env.example .env
    echo ⚠️  Created .env file - please edit with your credentials
)

cd ..
echo ✅ Backend setup complete
echo.

REM Frontend setup
echo 🎨 Setting up frontend...
cd frontend

call npm install

if not exist ".env.local" (
    copy .env.example .env.local
    echo ⚠️  Created .env.local file - please edit with your credentials
)

cd ..
echo ✅ Frontend setup complete
echo.

echo 🚀 Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your Telegram bot token and Google Sheets ID
echo 2. Edit frontend\.env.local with your API URL
echo 3. Run: cd backend ^& venv\Scripts\activate.bat ^& python -m uvicorn app.main:app --reload
echo 4. In another terminal: cd frontend ^& npm run dev
echo.
echo Access the app at: http://localhost:5173
echo API docs at: http://localhost:8000/docs
