@echo off
REM ============================================
REM Restaurant POS - Initial Setup Script
REM ============================================
REM This script initializes the project for first-time use

echo.
echo ============================================
echo   Restaurant POS - Initial Setup
echo ============================================
echo.

REM Create virtual environment
if not exist "renv" (
    echo [*] Creating Python virtual environment...
    python -m venv renv
    echo [+] Virtual environment created
)

REM Activate venv
call renv\Scripts\activate.bat

REM Install backend dependencies
echo [*] Installing backend dependencies...
pip install --upgrade pip setuptools wheel
pip install -r backend\requirements.txt
echo [+] Backend dependencies installed

REM Setup Django
echo [*] Setting up Django database...
cd backend
python manage.py migrate
echo [+] Database migrations complete

REM Create superuser (optional)
echo.
echo [?] Create a superuser account? (y/n)
set /p create_superuser=
if /i "%create_superuser%"=="y" (
    python manage.py createsuperuser
)

cd ..

REM Install frontend dependencies
echo [*] Installing frontend dependencies...
cd frontend\kitchen_app
call npm install
echo [+] Frontend dependencies installed
cd ..\..

echo.
echo ============================================
echo   [+] Setup complete!
echo ============================================
echo.
echo [i] Next steps:
echo     1. Edit .env.production with your settings
echo     2. Run: startup.bat (for production)
echo     3. Run: startup-dev.bat (for development)
echo.
echo [i] Admin panel: http://localhost:8000/admin
echo.
echo ============================================
echo.

pause
