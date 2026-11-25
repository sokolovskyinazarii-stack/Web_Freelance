@echo off
setlocal
cd /d "%~dp0"
title FreelanceHub - reset database

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js was not found. Install Node.js 22 and run this file again.
  echo.
  pause
  exit /b 1
)

if not exist ".env" (
  echo.
  echo .env file was not found. Copy .env.example to .env and fill in DATABASE_URL.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo.
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto error
)

echo.
echo WARNING: this will delete every record in the Neon database
echo and recreate the demo data from the seed files.
echo.
set /p answer=Type RESET to continue: 
if /i not "%answer%"=="RESET" (
  echo.
  echo Cancelled. Nothing was changed.
  echo.
  pause
  exit /b 1
)

echo.
echo Generating Prisma Client...
call npm run build
if errorlevel 1 goto error

echo.
echo Resetting and seeding the database...
call npm run db:reset
if errorlevel 1 goto error

echo.
echo Done. Demo accounts: prisma\seed-accounts.txt
echo.
pause
exit /b 0

:error
echo.
echo Failed. Check .env, Neon access and try again.
echo.
pause
exit /b 1
