# Fix Frontend CrashLoopBackOff Issue

## Problem
Frontend pods are crashing with `CrashLoopBackOff` status.

## Root Causes
1. **Wrong image name** - Deployment was using `saikrishna2004/frontend:latest` but local image is `fullstack-frontend:latest`
2. **Nginx service resolution** - Nginx might fail to resolve `backend-service` at startup

## Solution

### Step 1: Verify Local Image Exists

```bash
docker images | grep frontend
```

You should see `fullstack-frontend:latest`. If not, rebuild it:

```bash
cd frontend
docker build -t fullstack-frontend:latest --build-arg REACT_APP_API_URL=http://localhost:5000/api .
cd ..
```

### Step 2: Delete Old Frontend Pods

```bash
kubectl delete deployment frontend-deployment -n grocery-store
```

### Step 3: Apply Fixed Deployment

```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

### Step 4: Check Status

```bash
kubectl get pods -n grocery-store
```

Wait for pods to become `Running`.

### Step 5: Check Logs if Still Failing

```bash
# Get the pod name
kubectl get pods -n grocery-store -l app=frontend

# Check logs (replace <pod-name>)
kubectl logs <pod-name> -n grocery-store
```

## Alternative: Use Simpler Nginx Config

If the DNS resolver doesn't work, use this simpler nginx.conf:

```nginx
server {
    listen 3000;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-service:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then rebuild the frontend image:

```bash
cd frontend
docker build -t fullstack-frontend:latest --build-arg REACT_APP_API_URL=http://localhost:5000/api .
cd ..
kubectl delete deployment frontend-deployment -n grocery-store
kubectl apply -f k8s/frontend-deployment.yaml
```

## Verify Fix

```bash
# Check pods
kubectl get pods -n grocery-store

# Port forward
kubectl port-forward -n grocery-store service/frontend-service 3000:3000

# Access http://localhost:3000
```


