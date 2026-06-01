# 🍽️ Restaurant POS - Production Ready Setup

A complete Django REST + Next.js Point-of-Sale system configured for Windows 11 production deployment with simultaneous startup.

---

## 📋 Quick Start (5 Minutes)

### 1️⃣ **Initial Setup** (First time only)
Double-click: **`setup.bat`**
```
This will:
✓ Create Python virtual environment
✓ Install all dependencies
✓ Setup database with migrations
✓ Option to create admin account
```

### 2️⃣ **Start Application**

**For Production:**
```
Double-click: startup.bat
```

**For Development (with hot reload):**
```
Double-click: startup-dev.bat
```

### 3️⃣ **Access the Application**
- 🖥️ **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:8000/api
- ⚙️ **Admin Panel:** http://localhost:8000/admin

---

## 📂 Project Structure

```
Restaurant_POS/
├── backend/                      # Django REST API
│   ├── food/                    # Main Django project
│   │   ├── settings.py          # Base settings
│   │   ├── settings_production.py # Production settings
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── accounts/                # User management
│   ├── inventory/               # Stock management
│   ├── sales/                   # Sales orders
│   ├── payment/                 # Payments
│   ├── products/                # Product catalog
│   ├── report/                  # Reports
│   ├── audit/                   # Audit logs
│   ├── common/                  # Shared utilities
│   ├── manage.py
│   ├── requirements.txt
│   └── requirements-production.txt
│
├── frontend/                     # Next.js React app
│   └── kitchen_app/
│       ├── app/                 # Next.js app directory
│       ├── components/          # React components
│       ├── services/            # API services
│       ├── store/               # State management
│       ├── package.json
│       └── next.config.ts
│
├── renv/                         # Python virtual environment
│
├── Startup Scripts:
│   ├── setup.bat                # Initial setup
│   ├── startup.bat              # Production start
│   ├── startup-dev.bat          # Development start
│
├── Configuration:
│   ├── .env.production          # Production environment
│   ├── PRODUCTION_SETUP.md      # Detailed setup guide
│   ├── BOOT_STARTUP.md          # Auto-boot guide
│   └── README.md                # This file
```

---

## 🚀 Startup Scripts Explained

### `setup.bat` - Initial Configuration
**When:** First time after cloning the project
**What it does:**
- Creates Python virtual environment (renv/)
- Installs Python packages from requirements.txt
- Installs Node.js packages for frontend
- Runs Django migrations to create database
- Optionally creates admin superuser

### `startup.bat` - Production Deployment
**When:** Running in production environment
**What it does:**
- Activates virtual environment
- Builds Next.js optimized production bundle
- Runs Django with production settings
- Starts backend on port 8000
- Starts frontend on port 3000
- Opens both in separate terminal windows

### `startup-dev.bat` - Development Mode
**When:** During development/testing
**What it does:**
- Activates virtual environment
- Runs Django with hot reload (auto-restart on code changes)
- Runs Next.js with hot reload
- Enables debugging
- Shows detailed error messages

---

## ⚙️ Configuration

### Environment Variables (`.env.production`)

```bash
# Django Settings
DJANGO_SECRET_KEY=change-this-to-random-secure-string
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:8000/api
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Database (SQLite by default)
DATABASE_URL=sqlite:///db.sqlite3

# Security
SECURE_SSL_REDIRECT=False  # Set True if using HTTPS
SESSION_COOKIE_SECURE=False
```

### Important: Change These in Production

1. **DJANGO_SECRET_KEY** - Generate a secure random string:
   ```
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

2. **DJANGO_ALLOWED_HOSTS** - Add your actual domain:
   ```
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,mypos.example.com,www.mypos.example.com
   ```

3. **CORS_ALLOWED_ORIGINS** - Add your frontend URL:
   ```
   CORS_ALLOWED_ORIGINS=https://mypos.example.com
   ```

---

## 🛠️ Manual Operations

### Manage Database

```bash
# Run migrations
cd backend
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

### Backend Only (Django)
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### Frontend Only (Next.js)
```bash
cd frontend\kitchen_app
npm install
npm run dev      # Development
npm start        # Production
```

---

## 🔧 Troubleshooting

### ❌ Port Already in Use

**Error:** "Address already in use"

**Solution:**
```bash
# Find what's using the port
netstat -ano | findstr :8000    # for backend
netstat -ano | findstr :3000    # for frontend

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

### ❌ Python/Node Not Found

**Error:** "Python/Node not found"

**Solution:**
- Install Python from https://python.org (add to PATH)
- Install Node.js from https://nodejs.org
- Restart Command Prompt after installation

### ❌ CORS Errors in Frontend

**Error:** "CORS policy blocked"

**Solution:**
1. Check `.env.production`
2. Verify `CORS_ALLOWED_ORIGINS` matches frontend URL
3. Restart backend after changing .env

### ❌ Database Locked

**Error:** "Database is locked"

**Solution:**
- Close all terminal windows
- Delete `backend/db.sqlite3`
- Run `setup.bat` again

### ❌ Static Files Not Loading

**Error:** 404 on CSS/JS files

**Solution:**
```bash
cd backend
python manage.py collectstatic --clear --noinput
```

---

## 📊 System Requirements

### Minimum
- Windows 10/11
- Python 3.10+
- Node.js 18+
- 2GB RAM
- 500MB disk space

### Recommended
- Windows 11 Pro
- Python 3.11+
- Node.js 20 LTS
- 4GB+ RAM
- 2GB disk space (with dependencies)

---

## 🔐 Security Checklist

Before going to production:

- [ ] Change `DJANGO_SECRET_KEY` to a random secure string
- [ ] Set `DJANGO_DEBUG=False`
- [ ] Update `DJANGO_ALLOWED_HOSTS` with your domain
- [ ] Update `CORS_ALLOWED_ORIGINS` with your frontend URL
- [ ] Create strong admin password
- [ ] Backup database regularly
- [ ] Enable HTTPS (set SECURE_SSL_REDIRECT=True)
- [ ] Keep dependencies updated
- [ ] Monitor logs for errors

---

## 🚀 Production Optimization

### 1. Use Better Database (Optional)
SQLite works for small deployments. For production consider PostgreSQL:

```bash
pip install psycopg2-binary
# Update DATABASES in settings_production.py
```

### 2. Enable Caching
```bash
pip install django-redis
# Configure CACHES in settings_production.py
```

### 3. Use Production WSGI Server
```bash
gunicorn food.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### 4. Reverse Proxy with Nginx/Apache
Serve static files and handle HTTPS termination.

### 5. Monitor Application
- Keep terminal windows visible
- Check logs regularly
- Set up error notifications

---

## 📝 Common Tasks

### Add a New Admin User
```bash
cd backend
python manage.py createsuperuser
```

### Reset Database
```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Update Dependencies
```bash
# Backend
pip install -r backend/requirements.txt --upgrade

# Frontend
cd frontend/kitchen_app
npm update
```

### View Logs
- Check terminal output from startup windows
- Backend logs: `backend/logs/restaurant_pos.log` (if configured)

---

## 🆘 Getting Help

### Check Documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [DRF Documentation](https://www.django-rest-framework.org/)

### Debug Commands
```bash
# Check Django configuration
cd backend
python manage.py check

# Show available commands
python manage.py help

# Run tests
python manage.py test
```

---

## 📋 Next Steps

1. ✅ Run `setup.bat` to initialize
2. ✅ Edit `.env.production` with your settings
3. ✅ Run `startup.bat` to start application
4. ✅ Access http://localhost:3000
5. ✅ Login to admin at http://localhost:8000/admin
6. ✅ Configure your products, users, and inventory

---

## 📞 Support

For issues or questions:
- Check the [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) for detailed guides
- Check the [BOOT_STARTUP.md](BOOT_STARTUP.md) for auto-startup configuration
- Review application logs in terminal output
- Verify all ports are available and not blocked by firewall

---

## 📄 License

This is your Restaurant POS system. Customize and deploy as needed.

---

**Last Updated:** May 13, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
