# Production Windows Startup Guide
# ===================================

## Quick Start

1. **First Time Setup:**
   - Double-click `setup.bat`
   - This will install all dependencies and create the database

2. **Start Application (Production):**
   - Double-click `startup.bat`
   - Wait for both windows to appear (Backend ~3 sec, Frontend ~5 sec)

3. **Start Application (Development):**
   - Double-click `startup-dev.bat`
   - Supports hot reloading for both frontend and backend

---

## Configuration

### Environment Variables
Edit `.env.production` before running production:

```
DJANGO_SECRET_KEY=change-this-to-a-secure-random-string
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com,kitchenpos.onrender.com
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://kitchenpos-iota.vercel.app
DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://kitchenpos-iota.vercel.app
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require&channel_binding=require
DATABASE_CONN_MAX_AGE=600
```

### Access URLs
- **Frontend (Next.js):** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin

---

## What Each Script Does

### setup.bat
- Creates Python virtual environment (renv/)
- Installs Python and Node dependencies
- Runs Django database migrations
- Creates admin superuser (optional)

### startup.bat (Production)
- Activates virtual environment
- Builds Next.js production bundle
- Runs Django with production settings
- Runs Next.js with production server

### startup-dev.bat (Development)
- Activates virtual environment
- Runs Django development server (auto-reload)
- Runs Next.js development server (hot reload)

---

## Troubleshooting

### Issue: "Python not found"
- Install Python 3.10+ from python.org
- Add Python to PATH during installation

### Issue: "npm not found"
- Install Node.js from nodejs.org
- Restart Command Prompt after installation

### Issue: "Port 8000 already in use"
- Change DJANGO_PORT in .env.production
- Or kill the process: `netstat -ano | findstr :8000`

### Issue: "Port 3000 already in use"
- Edit startup script to use different port
- Or kill the process: `netstat -ano | findstr :3000`

### Issue: Database connection error
- Check `DATABASE_URL` in `.env` or `.env.production`
- Confirm the PostgreSQL host allows your connection
- Run `python backend\manage.py migrate` after fixing the URL

### Issue: CORS errors
- Check DJANGO_CORS_ALLOWED_ORIGINS in .env.production
- Must match your frontend URL

---

## Production Optimization Tips

1. **Security:**
   - Change DJANGO_SECRET_KEY to a random 50+ character string
   - Set DJANGO_DEBUG=False
   - Update DJANGO_ALLOWED_HOSTS with real domain

2. **Performance:**
   - Use a managed PostgreSQL database for production
   - Add nginx/Apache reverse proxy in front
   - Enable caching headers in Next.js

3. **Monitoring:**
   - Keep terminal windows visible to watch for errors
   - Consider using PM2 or Windows Services for monitoring
   - Set up logging to files instead of console

4. **Backups:**
   - Enable scheduled PostgreSQL backups in your database provider
   - Keep version control up to date

---

## Manual Commands (if needed)

### Backend only:
```
cd backend
python manage.py runserver 0.0.0.0:8000
```

### Frontend only:
```
cd frontend\kitchen_app
npm install
npm start  (production)
npm run dev (development)
```

### Database operations:
```
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
```

---

## Next Steps

1. Run `setup.bat` to initialize
2. Edit `.env.production` with your settings
3. Run `startup.bat` or `startup-dev.bat`
4. Access frontend at http://localhost:3000
5. Access admin at http://localhost:8000/admin

Enjoy your Restaurant POS system!
