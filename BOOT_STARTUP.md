# Restaurant POS - Windows Boot Startup Setup

## Automatic Startup at Windows Boot (Optional)

This is an advanced setup that makes your POS system start automatically when Windows boots.

### Option 1: Task Scheduler (Recommended)

1. Open **Task Scheduler** (search in Windows)
2. Click **"Create Basic Task"**
3. Fill in details:
   - **Name:** Restaurant POS Startup
   - **Description:** Auto-start Restaurant POS backend and frontend

4. **Trigger tab:**
   - Select "At startup"
   - Click Next

5. **Action tab:**
   - Select "Start a program"
   - **Program/script:** `cmd`
   - **Add arguments:** `/c startup.bat`
   - **Start in:** `C:\CodeSet\Restuarant_POS`
   - Click Next

6. **Finish** and enable the task

### Option 2: Startup Folder (Simple)

1. Press `Win + R`
2. Type: `shell:startup`
3. Create a shortcut to `startup.bat` in this folder
4. Windows will run it at startup

### Option 3: Batch Script in Startup Folder

1. Press `Win + R`
2. Type: `shell:startup`
3. Create a new file: `startup-pos.bat`
4. Add this content:

```batch
@echo off
cd /d C:\CodeSet\Restuarant_POS
start startup.bat
exit
```

### Stop Auto-Startup (if needed)

- **Option 1:** Disable in Task Scheduler
- **Option 2:** Delete from startup folder
- **Option 3:** Delete the batch file from startup folder

---

## Monitoring in Production

To keep both services running and auto-restart if they fail:

### Using PM2 (Advanced - Requires Node.js installed globally)

```batch
npm install -g pm2

REM In the project root:
pm2 start "python -m http.server 8000" --name "django"
pm2 start "npm start" --cwd frontend/kitchen_app --name "nextjs"
pm2 save
pm2 startup
```

Then access dashboard:
```
pm2 monit
pm2 logs
```

---

## Notes

- First startup will take longer (dependencies install)
- Subsequent startups are faster (cached)
- Make sure ports 8000 and 3000 are available
- Check Windows Firewall if ports are blocked
