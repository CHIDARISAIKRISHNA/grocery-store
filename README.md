# Grocery Store - Full Stack Application with CI/CD Pipeline

A modern full-stack grocery store application with complete CI/CD pipeline integration using Docker, Kubernetes, GitHub, and Jenkins.

## 🏗️ Architecture

- **Frontend**: React 18 with Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: Jenkins Pipeline
- **Version Control**: GitHub

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Local Development](#local-development)
4. [Docker Setup](#docker-setup) ✅ (Completed)
5. [Kubernetes Deployment](#kubernetes-deployment) ⬅️ **START HERE**
6. [GitHub Integration](#github-integration)
7. [Jenkins Setup](#jenkins-setup)
8. [Complete CI/CD Pipeline](#complete-cicd-pipeline)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ Docker Desktop installed and running
- ✅ Node.js v18+ installed
- ✅ Git installed
- ⬅️ Kubernetes cluster (Docker Desktop Kubernetes or Minikube)
- ⬅️ GitHub account
- ⬅️ Jenkins (Docker container or installed)

---

## Project Structure

```
fullstack/
├── backend/              # Node.js + Express API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   ├── Dockerfile       # Backend Docker image
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── context/     # React context
│   ├── Dockerfile       # Frontend Docker image
│   └── package.json
├── k8s/                 # Kubernetes manifests
│   ├── namespace.yaml
│   ├── mongodb-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-service.yaml
│   └── ingress.yaml
├── docker-compose.yml   # Local development
├── Jenkinsfile          # CI/CD pipeline definition
└── README.md
```

---

## Local Development

### Quick Start

```bash
# Start all services with Docker Compose
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - MongoDB: localhost:27017
```

### Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## Docker Setup ✅ (Completed)

Docker setup is complete. You have:
- ✅ Backend Docker image: `fullstack-backend:latest`
- ✅ Frontend Docker image: `fullstack-frontend:latest`
- ✅ Docker Compose working locally

**Next Step:** Deploy to Kubernetes

---

## Kubernetes Deployment ⬅️ **YOUR NEXT STEP**

### Step 1: Enable Kubernetes in Docker Desktop

1. Open **Docker Desktop**
2. Go to **Settings** (gear icon) → **Kubernetes**
3. Check ✅ **"Enable Kubernetes"**
4. Click **"Apply & Restart"**
5. Wait for Kubernetes to start (green indicator)

### Step 2: Verify Kubernetes

```bash
kubectl cluster-info
kubectl get nodes
```

You should see your local node.

### Step 3: Prepare Docker Images for Kubernetes

**Option A: Use Local Images (Quick Start)**

The Kubernetes manifests are already configured to use local images:
- `fullstack-backend:latest`
- `fullstack-frontend:latest`

**Option B: Push to Docker Hub (Recommended for CI/CD)**

```bash
# Login to Docker Hub
docker login

# Tag your images
docker tag fullstack-backend:latest YOUR_DOCKER_USERNAME/grocery-store-backend:latest
docker tag fullstack-frontend:latest YOUR_DOCKER_USERNAME/grocery-store-frontend:latest

# Push to Docker Hub
docker push YOUR_DOCKER_USERNAME/grocery-store-backend:latest
docker push YOUR_DOCKER_USERNAME/grocery-store-frontend:latest
```

**Then update Kubernetes manifests:**

Edit `k8s/backend-deployment.yaml` line 20:
```yaml
image: YOUR_DOCKER_USERNAME/grocery-store-backend:latest
imagePullPolicy: Always
```

Edit `k8s/frontend-deployment.yaml` line 20:
```yaml
image: YOUR_DOCKER_USERNAME/grocery-store-frontend:latest
imagePullPolicy: Always
```

### Step 4: Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Wait for MongoDB to be ready (30 seconds)
timeout /t 30  # Windows
# Or: sleep 30  # Linux/Mac

# Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Deploy Services
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-service.yaml
```

### Step 5: Check Deployment Status

```bash
# Check all resources
kubectl get all -n grocery-store

# Check pods (wait until all show "Running")
kubectl get pods -n grocery-store

# Check services
kubectl get services -n grocery-store
```

### Step 6: Access Your Application

**Option A: Port Forwarding (Recommended)**

Open **two terminals**:

**Terminal 1 - Backend:**
```bash
kubectl port-forward -n grocery-store service/backend-service 5000:5000
```

**Terminal 2 - Frontend:**
```bash
kubectl port-forward -n grocery-store service/frontend-service 3000:3000
```

Then access:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Backend API:** http://localhost:5000/api/products

**Option B: LoadBalancer (if supported)**

```bash
kubectl get services -n grocery-store
# Use the EXTERNAL-IP addresses shown
```

### Step 7: Seed the Database

```bash
# Get backend pod name
kubectl get pods -n grocery-store -l app=backend

# Run seed script (replace <pod-name> with actual pod name)
kubectl exec -it <pod-name> -n grocery-store -- npm run seed
```

### Step 8: Verify Everything Works

1. Open http://localhost:3000
2. Navigate to Products page
3. You should see products loaded
4. Test adding items to cart

**Kubernetes Deployment Complete! ✅**

---

## GitHub Integration

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click **"New repository"**
3. Name: `grocery-store`
4. Choose **Public** or **Private**
5. **Don't** initialize with README (you already have one)
6. Click **"Create repository"**

### Step 2: Push Code to GitHub

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit: Grocery Store with CI/CD"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/grocery-store.git
git branch -M main
git push -u origin main
```

### Step 3: Verify on GitHub

- Go to your repository on GitHub
- You should see all your files
- Verify `Jenkinsfile` is present

**GitHub Integration Complete! ✅**

---

## Jenkins Setup

### Step 1: Install Jenkins

**Option A: Using Docker (Recommended)**

```bash
# Run Jenkins container
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

# Get initial admin password
docker logs jenkins
# Look for: "Jenkins initial setup is required. Password: [password]"
# Copy that password!
```

**Windows PowerShell:**
```powershell
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts
docker logs jenkins
```

### Step 2: Initial Jenkins Setup

1. Open browser: http://localhost:8080
2. Enter the password from Step 1
3. Click **"Install suggested plugins"**
4. Wait for installation to complete
5. Create admin user (or skip to use admin)
6. Click **"Save and Finish"**
7. Click **"Start using Jenkins"**

### Step 3: Install Required Plugins

1. Go to: **Manage Jenkins** → **Manage Plugins** → **Available**
2. Search and install:
   - **Git**
   - **Docker Pipeline**
   - **Kubernetes CLI**
   - **GitHub Integration**
   - **Pipeline**
3. Click **"Install without restart"**
4. Wait for installation

### Step 4: Configure Docker Registry Credentials

1. Go to: **Manage Jenkins** → **Manage Credentials** → **System** → **Global credentials**
2. Click **"Add Credentials"**
3. Fill in:
   - **Kind:** Username with password
   - **ID:** `docker-registry-credentials` (exact name required!)
   - **Username:** Your Docker Hub username
   - **Password:** Your Docker Hub password/token
4. Click **"OK"**

### Step 5: Configure kubectl in Jenkins

**If Jenkins is in Docker:**

```bash
# Install kubectl in Jenkins container
docker exec -it jenkins bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/
exit
```

**Verify kubectl works:**
```bash
docker exec jenkins kubectl version --client
```

### Step 6: Update Jenkinsfile

Edit `Jenkinsfile` in your project root, line 5:

```groovy
DOCKER_REGISTRY = 'YOUR_DOCKER_USERNAME'  // Your Docker Hub username
```

**Example:**
```groovy
DOCKER_REGISTRY = 'johndoe'  // If your Docker Hub username is 'johndoe'
```

**Commit and push:**
```bash
git add Jenkinsfile
git commit -m "Update Jenkinsfile with Docker registry"
git push origin main
```

### Step 7: Create Jenkins Pipeline Job

1. In Jenkins, click **"New Item"**
2. Enter name: `grocery-store-pipeline`
3. Select **"Pipeline"**
4. Click **"OK"**
5. Scroll to **"Pipeline"** section:
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** `https://github.com/YOUR_USERNAME/grocery-store.git`
   - **Credentials:** (Leave empty if public repo)
   - **Branch:** `*/main`
   - **Script Path:** `Jenkinsfile`
6. Click **"Save"**

**Jenkins Setup Complete! ✅**

---

## Complete CI/CD Pipeline

### Pipeline Flow Diagram

```
┌─────────────┐
│   GitHub    │ (Code Repository)
└──────┬──────┘
       │
       │ (Webhook Trigger)
       ▼
┌─────────────┐
│   Jenkins   │ (CI/CD Server)
└──────┬──────┘
       │
       ├──► 1. Checkout Code from GitHub
       │
       ├──► 2. Build Frontend Docker Image
       │
       ├──► 3. Build Backend Docker Image
       │
       ├──► 4. Run Tests (Optional)
       │
       ├──► 5. Push Images to Docker Hub
       │
       ├──► 6. Deploy to Kubernetes
       │    ├── Update K8s manifests
       │    ├── Apply deployments
       │    └── Wait for rollouts
       │
       └──► 7. Health Checks
            └── Verify services are running
```

### Step 1: Configure GitHub Webhook

1. Go to your GitHub repository
2. Click **Settings** → **Webhooks**
3. Click **"Add webhook"**
4. Fill in:
   - **Payload URL:** `http://YOUR_JENKINS_IP:8080/github-webhook/`
     - If Jenkins is local: `http://localhost:8080/github-webhook/`
     - If Jenkins is on server: `http://YOUR_SERVER_IP:8080/github-webhook/`
   - **Content type:** `application/json`
   - **Events:** Select **"Just the push event"**
5. Click **"Add webhook"**

**Note:** If Jenkins is behind a firewall, use **ngrok**:
```bash
# Install ngrok, then:
ngrok http 8080
# Use the ngrok URL in webhook
```

### Step 2: Run First Pipeline Manually

1. Go to Jenkins: http://localhost:8080
2. Click on **"grocery-store-pipeline"**
3. Click **"Build Now"**
4. Click on the build number to see progress
5. Watch the pipeline stages execute

### Step 3: Verify Automatic Deployment

1. Make a small change to any file:
```bash
echo "# Test CI/CD" >> README.md
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

2. Go to Jenkins
3. You should see a new build automatically start!
4. Wait for it to complete
5. Check Kubernetes - new pods should be deployed

### Step 4: Verify Deployment

```bash
# Check pods
kubectl get pods -n grocery-store

# Check services
kubectl get services -n grocery-store

# View logs
kubectl logs -f deployment/backend-deployment -n grocery-store
```

**CI/CD Pipeline Complete! ✅**

---

## Pipeline Stages Explained

### 1. Checkout Stage
- Clones code from GitHub repository
- **Duration:** ~10-30 seconds

### 2. Build Frontend Stage
- Builds React application Docker image
- **Duration:** ~2-5 minutes

### 3. Build Backend Stage
- Builds Node.js API Docker image
- **Duration:** ~1-3 minutes

### 4. Test Stages
- Runs automated tests (optional)
- **Duration:** ~30 seconds - 2 minutes

### 5. Push Images Stage
- Pushes Docker images to Docker Hub
- **Duration:** ~1-5 minutes (depends on image size)

### 6. Deploy to Kubernetes Stage
- Updates Kubernetes manifests with new image tags
- Applies deployments to cluster
- Waits for rollouts to complete
- **Duration:** ~2-5 minutes

### 7. Health Check Stage
- Verifies backend health endpoint
- Verifies frontend is accessible
- **Duration:** ~10-30 seconds

---

## Useful Commands

### Kubernetes Commands

```bash
# Deploy everything
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-service.yaml

# Check status
kubectl get all -n grocery-store
kubectl get pods -n grocery-store
kubectl get services -n grocery-store

# View logs
kubectl logs -f deployment/backend-deployment -n grocery-store
kubectl logs -f deployment/frontend-deployment -n grocery-store

# Port forward
kubectl port-forward -n grocery-store service/backend-service 5000:5000
kubectl port-forward -n grocery-store service/frontend-service 3000:3000

# Delete everything
kubectl delete namespace grocery-store

# Restart deployment
kubectl rollout restart deployment/backend-deployment -n grocery-store
```

### Docker Commands

```bash
# Build images
docker build -t fullstack-backend:latest ./backend
docker build -t fullstack-frontend:latest --build-arg REACT_APP_API_URL=http://localhost:5000/api ./frontend

# Push to Docker Hub
docker login
docker tag fullstack-backend:latest YOUR_USERNAME/grocery-store-backend:latest
docker push YOUR_USERNAME/grocery-store-backend:latest
```

### Jenkins Commands

```bash
# View Jenkins logs
docker logs jenkins

# Restart Jenkins
docker restart jenkins

# Stop Jenkins
docker stop jenkins

# Start Jenkins
docker start jenkins
```

### Git Commands

```bash
# Commit and push
git add .
git commit -m "Your message"
git push origin main

# Check status
git status
git log --oneline
```

---

## Troubleshooting

### Kubernetes Issues

**Pods not starting:**
```bash
# Check pod status
kubectl describe pod <pod-name> -n grocery-store

# View pod logs
kubectl logs <pod-name> -n grocery-store

# Check events
kubectl get events -n grocery-store --sort-by='.lastTimestamp'
```

**Image pull errors:**
- Verify image exists: `docker images`
- Check `imagePullPolicy` in deployment files
- Make sure images are pushed to Docker Hub (if using remote registry)

**Services not accessible:**
```bash
# Check service endpoints
kubectl get endpoints -n grocery-store

# Use port-forwarding for local access
kubectl port-forward -n grocery-store service/backend-service 5000:5000
```

### Jenkins Issues

**Pipeline fails at checkout:**
- Verify GitHub repository URL is correct
- Check if repository is public or credentials are configured

**Pipeline fails at build:**
- Check Docker daemon is accessible from Jenkins
- Verify Dockerfile syntax is correct

**Pipeline fails at push:**
- Verify Docker Hub credentials are correct
- Check credential ID is `docker-registry-credentials`

**Pipeline fails at deploy:**
- Verify kubectl is installed in Jenkins
- Check Kubernetes cluster is accessible
- Verify image names in manifests match Docker Hub

### GitHub Issues

**Webhook not triggering:**
- Check webhook URL is correct
- Verify Jenkins is accessible from internet (use ngrok if local)
- Check webhook delivery logs in GitHub

**Push errors:**
- Verify remote URL: `git remote -v`
- Check authentication: `git config --global user.name` and `user.email`

---

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId/items` - Add item to cart
- `PUT /api/cart/:userId/items/:itemId` - Update cart item
- `DELETE /api/cart/:userId/items/:itemId` - Remove item from cart

### Orders
- `GET /api/orders/:userId` - Get user orders
- `POST /api/orders/:userId` - Create order

### Health
- `GET /health` - Health check endpoint
- `GET /` - API information

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-store
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Port Configuration

- **Frontend:** Port 3000
- **Backend:** Port 5000
- **MongoDB:** Port 27017

In Kubernetes, these are exposed via LoadBalancer services or port-forwarding.

---

## Next Steps

After completing the CI/CD pipeline:

1. **Set up Ingress** - For external access without port-forwarding
2. **Configure Persistent Volumes** - For MongoDB data persistence
3. **Set up Monitoring** - Prometheus, Grafana
4. **Configure Autoscaling** - Horizontal Pod Autoscaler (HPA)
5. **Add SSL/TLS** - Secure connections
6. **Set up Backup** - MongoDB backup strategy

---

## Summary

### ✅ Completed Steps:
1. Docker setup and containerization
2. Local development with Docker Compose

### ⬅️ Next Steps (In Order):
1. **Kubernetes Deployment** - Deploy to Kubernetes cluster
2. **GitHub Integration** - Push code to GitHub
3. **Jenkins Setup** - Install and configure Jenkins
4. **CI/CD Pipeline** - Complete automated deployment

### 🎯 Final Result:
- **Automatic deployment** on every code push
- **Docker images** built automatically
- **Kubernetes deployment** automated
- **Health checks** verify deployment success

---

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Jenkins build logs
3. Check Kubernetes pod logs
4. Verify all prerequisites are met

---

## License

ISC

---

**Follow this guide step by step to complete your CI/CD pipeline!** 🚀

**Current Status:** Docker ✅ → **Next: Kubernetes** ⬅️
