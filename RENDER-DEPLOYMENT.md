# Render.com Deployment Guide

## Free Deployment to Render.com

### Step 1: Create render.yaml
Already created - see render.yaml in your project

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click "New" → "Web Service"
3. Connect your GitHub repository (sparrowbot)
4. Render will auto-detect Node.js and use the settings from render.yaml

### Step 3: Set Environment Variables
In your Render dashboard, add these environment variables:
- OPENAI_API_KEY: your_openai_api_key
- OPENAI_MODEL: gpt-4o-mini
- JWT_SECRET: your_secure_random_string
- NODE_ENV: production

### Free Tier Limits:
- 750 hours/month (always on with paid plan)
- Apps sleep after 15 minutes of inactivity
- 100GB bandwidth/month
- Custom domains supported

### Your app will be live at:
https://your-app-name.onrender.com
