# Deployment Troubleshooting

## Common Issues and Solutions

### Issue 1: Build Command Failing
**Solution**: Simplified build process in render.yaml

### Issue 2: Client Build Missing
**Solution**: Server now handles missing client build gracefully

### Issue 3: Environment Variables
**Required in Render Dashboard**:
- OPENAI_API_KEY: your_openai_api_key
- JWT_SECRET: secure_random_string

### Testing Deployment
1. Check server health: `/api/health`
2. Test API endpoints: `/api/session-types`
3. Build client separately if needed

### Quick Deploy Process
1. Push changes to GitHub
2. Render will auto-deploy
3. Check logs for errors
4. Set environment variables if missing
