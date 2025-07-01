@echo off
title Sparring Bot - AI Training System
cls
echo.
echo ╔══════════════════════════════════════╗
echo ║          Sparring Bot v2.1           ║
echo ║    AI Training System Starting...    ║
echo ╚══════════════════════════════════════╝
echo.
echo 🚀 Starting server...
start /B node server.js
echo ⏳ Waiting for server to initialize...
timeout /t 5 /nobreak >nul
echo 🌐 Opening browser...
start http://localhost:8080
echo.
echo ✅ Sparring Bot is now running!
echo 📱 Access: http://localhost:8080
echo.
echo ⚠️  Keep this window open while using Sparring Bot
echo 🛑 Close this window to stop the server
echo.
pause