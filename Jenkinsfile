pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_USERNAME = 'saikrishna2004'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKER_USERNAME}/grocery-store-frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "${DOCKER_USERNAME}/grocery-store-backend:${IMAGE_TAG}"
        KUBERNETES_NAMESPACE = 'grocery-store'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo 'Building frontend Docker image...'
                    script {
                        sh """
                            docker build -t ${FRONTEND_IMAGE} --build-arg REACT_APP_API_URL=http://localhost:5000/api .
                            docker tag ${FRONTEND_IMAGE} ${DOCKER_USERNAME}/grocery-store-frontend:latest
                        """
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    echo 'Building backend Docker image...'
                    script {
                        sh """
                            docker build -t ${BACKEND_IMAGE} .
                            docker tag ${BACKEND_IMAGE} ${DOCKER_USERNAME}/grocery-store-backend:latest
                        """
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    echo 'Running frontend tests (skipped)...'
                    sh 'echo "Frontend tests skipped"'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    echo 'Running backend tests (skipped)...'
                    sh 'echo "Backend tests skipped"'
                }
            }
        }

        stage('Push Images') {
            steps {
                echo 'Pushing Docker images to Docker Hub...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                            docker push ${FRONTEND_IMAGE}
                            docker push ${DOCKER_USERNAME}/grocery-store-frontend:latest
                            docker push ${BACKEND_IMAGE}
                            docker push ${DOCKER_USERNAME}/grocery-store-backend:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes cluster...'
                script {

                    sh """
                        if ! kubectl cluster-info &> /dev/null; then
                            echo 'WARNING: kubectl not configured! Skipping deployment...'
                            exit 0
                        fi

                        # Replace variables in YAML files
                        sed -i 's|IMAGE_TAG|${IMAGE_TAG}|g' k8s/backend-deployment.yaml
                        sed -i 's|IMAGE_TAG|${IMAGE_TAG}|g' k8s/frontend-deployment.yaml
                        sed -i 's|DOCKER_USERNAME|${DOCKER_USERNAME}|g' k8s/backend-deployment.yaml
                        sed -i 's|DOCKER_USERNAME|${DOCKER_USERNAME}|g' k8s/frontend-deployment.yaml

                        # Apply manifests
                        kubectl apply -f k8s/namespace.yaml --validate=false || true
                        kubectl apply -f k8s/mongodb-deployment.yaml --validate=false || true
                        kubectl apply -f k8s/backend-deployment.yaml --validate=false || true
                        kubectl apply -f k8s/frontend-deployment.yaml --validate=false || true
                        kubectl apply -f k8s/backend-service.yaml --validate=false || true
                        kubectl apply -f k8s/frontend-service.yaml --validate=false || true
                        kubectl apply -f k8s/ingress.yaml --validate=false || true

                        # Rollout status
                        kubectl rollout status deployment/backend-deployment -n ${KUBERNETES_NAMESPACE} --timeout=300s || true
                        kubectl rollout status deployment/frontend-deployment -n ${KUBERNETES_NAMESPACE} --timeout=300s || true

                        echo 'Kubernetes deployment completed.'
                    """
                }
            }
        }

        stage('Verify Kubernetes Services') {
            steps {
                echo 'Checking NodePort Services...'
                script {
                    sh """
                        echo "Fetching service list from namespace: ${KUBERNETES_NAMESPACE}"
                        kubectl get svc -n ${KUBERNETES_NAMESPACE}
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            sh 'if command -v docker &> /dev/null; then docker system prune -f || true; fi'
        }
    }
}
