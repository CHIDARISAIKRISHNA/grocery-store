#!/bin/bash
# Push script for Docker images to registry

set -e  # Exit on error

# Configuration - CHANGE THIS!
DOCKER_USERNAME="${DOCKER_USERNAME:-YOUR_DOCKER_USERNAME}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

if [ "$DOCKER_USERNAME" == "YOUR_DOCKER_USERNAME" ]; then
    echo "❌ Error: Please set DOCKER_USERNAME environment variable"
    echo "   Example: export DOCKER_USERNAME=yourusername"
    echo "   Or edit this script and set DOCKER_USERNAME variable"
    exit 1
fi

echo "🔐 Logging in to Docker Hub..."
docker login

echo ""
echo "🏷️  Tagging images..."
docker tag grocery-store-backend:latest ${DOCKER_USERNAME}/grocery-store-backend:${IMAGE_TAG}
docker tag grocery-store-frontend:latest ${DOCKER_USERNAME}/grocery-store-frontend:${IMAGE_TAG}

echo ""
echo "📤 Pushing backend image..."
docker push ${DOCKER_USERNAME}/grocery-store-backend:${IMAGE_TAG}

echo ""
echo "📤 Pushing frontend image..."
docker push ${DOCKER_USERNAME}/grocery-store-frontend:${IMAGE_TAG}

echo ""
echo "✅ Push complete!"
echo "📋 Images available at:"
echo "   - ${DOCKER_USERNAME}/grocery-store-backend:${IMAGE_TAG}"
echo "   - ${DOCKER_USERNAME}/grocery-store-frontend:${IMAGE_TAG}"

