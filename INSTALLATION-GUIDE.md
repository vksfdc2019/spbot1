# Sparring Bot - Installation Guide

## 🚀 Quick Start

### Option 1: Simple Start (Recommended)
1. Double-click **Start-SparringBot.bat**
2. Wait for the browser to open automatically
3. Start training!

### Option 2: Advanced Start
1. Right-click **Start-SparringBot.ps1**
2. Select "Run with PowerShell"
3. More detailed startup process

## ⚙️ Configuration

### OpenAI API Setup (Required)
1. Open the **.env** file in a text editor
2. Replace `your_openai_api_key_here` with your actual OpenAI API key
3. Get your API key from: https://platform.openai.com/api-keys

### Example .env configuration:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
JWT_SECRET=sparring_bot_secret_key_2024_secure
PORT=8080
NODE_ENV=production
```

## 🎯 Features

- ✅ Voice-enabled training sessions
- ✅ AI-powered customer simulation
- ✅ Real-time scoring and feedback
- ✅ Session recording and playback
- ✅ User management system
- ✅ Admin dashboard
- ✅ Customizable training scenarios

## 🔧 System Requirements

- **Operating System**: Windows 10/11
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 500MB free space
- **Network**: Internet connection for AI features
- **Browser**: Chrome, Edge, or Firefox

## 🌐 Access URLs

- **Main Application**: http://localhost:8080
- **Admin Dashboard**: http://localhost:8080/admin
- **API Documentation**: http://localhost:8080/api

## 🆘 Troubleshooting

### Server won't start
- Check if port 8080 is available
- Ensure all files are extracted properly
- Try running as Administrator

### AI features not working
- Verify your OpenAI API key is correct
- Check your internet connection
- Ensure you have API credits available

### Browser doesn't open
- Manually navigate to http://localhost:8080
- Check Windows Firewall settings
- Try a different browser

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the console output for error messages
3. Contact support with specific error details

---

**Sparring Bot v2.1** - AI-Powered Customer Service Training Platform
Developed with ❤️ for better customer service training