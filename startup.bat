@echo off
REM ============================================
REM Restaurant POS - Production Startup Script
REM ============================================
REM This script starts both frontend and backend
REM simultaneously on Windows

setlocal enabledelayedexpansion

REM Define colors for console output
for /F %%A in ('copy /Z "%~f0" nul') do set "BS=%%A"

echo.
echo ============================================
echo   Restaurant POS - Production Startup
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
echo [*] Starting Backend (Django) on port 8000...
start "Restaurant POS - Backend" cmd /k "cd backend && python manage.py runserver 0.0.0.0:8000"

timeout /t 3 /nobreak

echo [*] Starting Frontend (Next.js) on port 3000...
echo [!] Building Next.js application (this may take a minute)...
cd frontend\kitchen_app
call npm install --silent
echo [*] Building production bundle...
call npm run build
echo [+] Build complete. Starting Next.js server...
start "Restaurant POS - Frontend" cmd /k "npm start"

cd ..\..

timeout /t 2 /nobreak

echo.
echo ============================================
echo   [+] Both services are starting!
echo ============================================
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   Admin:    http://localhost:8000/admin
echo.
echo [i] Two new windows will appear for each service
echo [i] Both services will run in the background
echo [i] Close either window to stop that service
echo.
echo ============================================
echo.

pause
