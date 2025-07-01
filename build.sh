#!/bin/bash
# Build script for Railway deployment

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building client application..."
cd client
npm install
npm run build
cd ..

echo "✅ Build completed successfully!"
