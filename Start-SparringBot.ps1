# Sparring Bot PowerShell Launcher
Write-Host "🤖 Sparring Bot - Advanced Launcher" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check for required files
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start the server
Write-Host "🚀 Starting Sparring Bot server..." -ForegroundColor Green
$serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden

# Wait for server
Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Server is running successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Server may still be starting..." -ForegroundColor Yellow
}

# Open browser
Write-Host "🌐 Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "🎉 Sparring Bot is ready!" -ForegroundColor Green
Write-Host "📱 Access at: http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Keep this window open. Press any key to stop the server." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop server
if ($serverProcess -and !$serverProcess.HasExited) {
    $serverProcess.Kill()
    Write-Host "🛑 Server stopped." -ForegroundColor Red
}