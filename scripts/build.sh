#!/bin/bash
# Build script for Docker images

set -e  # Exit on error

echo "🚀 Starting Docker build process..."
echo ""

# Build backend
echo "📦 Building backend image..."
cd backend
docker build -t grocery-store-backend:latest .
echo "✅ Backend image built successfully!"
echo ""

# Build frontend
echo "📦 Building frontend image..."
cd ../frontend
docker build -t grocery-store-frontend:latest --build-arg REACT_APP_API_URL=http://localhost:5000/api .
echo "✅ Frontend image built successfully!"
echo ""

# Return to root directory
cd ..

echo "📋 Summary of built images:"
docker images | grep grocery-store

echo ""
echo "✅ Build complete! Use 'docker-compose up' to start all services."

