@echo off
REM ============================================
REM Restaurant POS - Development Startup Script
REM ============================================
REM This script starts both frontend and backend
REM in development mode with hot reloading

setlocal enabledelayedexpansion

echo.
echo ============================================
echo   Restaurant POS - Development Startup
echo ============================================
echo.

REM Check if venv exists, if not create it
if not exist "renv\Scripts\activate.bat" (
    echo [*] Python virtual environment not found. Creating...
    python -m venv renv
    call renv\Scripts\activate.bat
    pip install --upgrade pip
    pip install -r backend\requirements.txt
    echo [+] Virtual environment created and dependencies installed
) else (
    echo [+] Virtual environment found
    call renv\Scripts\activate.bat
)

echo.
echo [*] Starting Backend (Django Dev Server) on port 8000...
start "Restaurant POS - Backend (DEV)" cmd /k "cd backend && python manage.py runserver"

timeout /t 3 /nobreak

echo [*] Starting Frontend (Next.js Dev Server) on port 3000...
cd frontend\kitchen_app
call npm install --silent
start "Restaurant POS - Frontend (DEV)" cmd /k "npm run dev"

cd ..\..

timeout /t 2 /nobreak

echo.
echo ============================================
echo   [+] Both services are starting in DEV mode!
echo ============================================
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   Admin:    http://localhost:8000/admin
echo.
echo [i] Hot reload is enabled for both services
echo [i] Close either window to stop that service
echo.
echo ============================================
echo.

pause
