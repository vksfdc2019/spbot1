# Railway Deployment Guide

## Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/sparring-bot)

## Manual Deployment Steps

1. **Connect Repository**: 
   - Go to railway.app and create new project
   - Connect your GitHub repository

2. **Environment Variables**:
   Set these in Railway dashboard:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key
   OPENAI_MODEL=gpt-4o-mini
   JWT_SECRET=your_secure_random_string_here
   NODE_ENV=production
   PORT=8080
   ```

3. **Deploy**: Railway will automatically build and deploy

## Environment Variables Required

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: Model to use (recommended: gpt-4o-mini)
- `JWT_SECRET`: Secure random string for JWT tokens
- `NODE_ENV`: Set to "production"
- `PORT`: Railway will set this automatically

## Post-Deployment

1. Your app will be available at: `https://your-app-name.railway.app`
2. Default admin credentials:
   - Username: admin
   - Password: admin (change immediately!)

## Important Notes

- File uploads (recordings) are ephemeral on Railway
- Consider using external storage (AWS S3) for recordings in production
- Monitor usage and costs on Railway dashboard
