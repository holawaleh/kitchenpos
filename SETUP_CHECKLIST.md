# ✅ Restaurant POS - Production Setup Checklist

## Files Created

### 🚀 Startup Scripts (Root Directory)
- [x] **startup.bat** - Production mode with optimized build
- [x] **startup-dev.bat** - Development mode with hot reload
- [x] **setup.bat** - Initial setup and configuration

### ⚙️ Backend Configuration
- [x] **.env.production** - Environment variables
- [x] **backend/food/settings_production.py** - Production Django settings
- [x] **backend/requirements-production.txt** - Production packages
- [x] **backend/install-production-deps.bat** - Install command

### 📚 Documentation
- [x] **README.md** - Complete setup guide (START HERE!)
- [x] **PRODUCTION_SETUP.md** - Detailed configuration
- [x] **BOOT_STARTUP.md** - Windows auto-boot guide
- [x] **SETUP_CHECKLIST.md** - This file

---

## 📋 What You Need to Do

### Step 1: Initial Setup (First Time Only)
```
1. Navigate to: C:\CodeSet\Restuarant_POS
2. Double-click: setup.bat
3. Wait for completion (2-5 minutes)
4. Create admin account when prompted
```

### Step 2: Configure Production Settings
```
1. Open: .env.production
2. Change: DJANGO_SECRET_KEY to random string
3. Update: DJANGO_ALLOWED_HOSTS with your domain
4. Update: DJANGO_CORS_ALLOWED_ORIGINS with your frontend URL
5. Save file
```

### Step 3: Start Application

**For Production:**
```
Double-click: startup.bat
Wait ~10 seconds for both windows to appear
```

**For Development:**
```
Double-click: startup-dev.bat
Wait ~10 seconds for both windows to appear
```

### Step 4: Access Application
```
Frontend:   http://localhost:3000
Backend:    http://localhost:8000/api
Admin:      http://localhost:8000/admin
```

---

## 🔧 Ports Used

| Service | Port | URL |
|---------|------|-----|
| Django Backend | 8000 | http://localhost:8000 |
| Next.js Frontend | 3000 | http://localhost:3000 |
| Django Admin | 8000 | http://localhost:8000/admin |

---

## 📊 System Architecture

```
┌─────────────────────────────────────┐
│      Windows 11 Pro Computer        │
└─────────────────────────────────────┘
              │
        ┌─────┴─────┐
        │           │
    ┌───▼──┐    ┌──▼────┐
    │      │    │       │
┌───┴─┐┌──┴┴─┐┌┴──┐┌──┐┤
│Next│││Djan│││SQL│││
│.js ││go  ││ite├┤
│Port││Port│├DB│
│3000││8000││  │
└────┘└────┘└──┘
```

---

## 🎯 Production Checklist

### Before Going Live
- [ ] Run setup.bat successfully
- [ ] startup.bat runs both services
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/admin
- [ ] Can login with admin account
- [ ] .env.production configured with real settings
- [ ] DJANGO_DEBUG set to False
- [ ] DJANGO_SECRET_KEY changed
- [ ] PostgreSQL DATABASE_URL configured
- [ ] Database migrations completed
- [ ] Database backup policy configured

### Security
- [ ] Changed DJANGO_SECRET_KEY
- [ ] Set DJANGO_DEBUG=False
- [ ] Updated ALLOWED_HOSTS
- [ ] Updated DJANGO_CORS_ALLOWED_ORIGINS
- [ ] Created strong admin password
- [ ] Configured HTTPS (if on internet)

### Windows Boot Auto-Start (Optional)
- [ ] Follow BOOT_STARTUP.md guide
- [ ] Test startup after Windows reboot

---

## 🆘 If Something Goes Wrong

### Port Already in Use
```
netstat -ano | findstr :8000
taskkill /PID <number> /F
```

### Python Not Found
- Install from python.org
- Add to PATH
- Restart Command Prompt

### npm Not Found
- Install Node.js from nodejs.org
- Add to PATH
- Restart Command Prompt

### CORS Errors
- Edit .env.production
- Update DJANGO_CORS_ALLOWED_ORIGINS
- Restart backend

### Database Issues
- Check DATABASE_URL in .env or .env.production
- Confirm PostgreSQL network access
- Run backend migrations again

---

## 📝 What Each Script Does

### setup.bat
```
✓ Creates Python venv
✓ Installs Python packages
✓ Installs Node packages
✓ Runs migrations
✓ Creates admin account
```

### startup.bat (Production)
```
✓ Activates venv
✓ Builds Next.js
✓ Starts Django
✓ Starts Next.js
✓ Opens both in new windows
```

### startup-dev.bat (Development)
```
✓ Activates venv
✓ Starts Django with hot reload
✓ Starts Next.js with hot reload
✓ Opens both in new windows
```

---

## 🔗 Useful Links

- **Django Docs:** https://docs.djangoproject.com/
- **Next.js Docs:** https://nextjs.org/docs
- **DRF Docs:** https://www.django-rest-framework.org/
- **Python:** https://python.org
- **Node.js:** https://nodejs.org

---

## 📞 Troubleshooting Guide

See: **PRODUCTION_SETUP.md** for detailed troubleshooting

Common issues:
1. Port conflicts
2. Python/Node not installed
3. CORS errors
4. Database locked
5. Static files not loading

---

## ✅ Status

**Setup Status:** ✅ COMPLETE  
**Ready to Run:** ✅ YES  
**Production Ready:** ✅ YES (after configuration)

Next: Run **setup.bat** to initialize!

---

**Created:** May 13, 2026  
**Version:** 1.0.0  
**For:** Windows 11 Pro
