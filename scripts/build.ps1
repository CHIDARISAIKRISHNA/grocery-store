# PowerShell Build Script for Docker Images

Write-Host "🚀 Starting Docker build process..." -ForegroundColor Green
Write-Host ""

# Build backend
Write-Host "📦 Building backend image..." -ForegroundColor Yellow
Set-Location backend
docker build -t grocery-store-backend:latest .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend image built successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Build frontend
Write-Host "📦 Building frontend image..." -ForegroundColor Yellow
Set-Location ../frontend
docker build -t grocery-store-frontend:latest --build-arg REACT_APP_API_URL=http://localhost:5000/api .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend image built successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Return to root directory
Set-Location ..

Write-Host "📋 Summary of built images:" -ForegroundColor Cyan
docker images | Select-String "grocery-store"

Write-Host ""
Write-Host "✅ Build complete! Use 'docker-compose up' to start all services." -ForegroundColor Green

