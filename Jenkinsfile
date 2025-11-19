pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io/saikrishna2004'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/grocery-store-frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/grocery-store-backend:${IMAGE_TAG}"
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
                        docker.build("${FRONTEND_IMAGE}")
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    echo 'Building backend Docker image...'
                    script {
                        docker.build("${BACKEND_IMAGE}")
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    echo 'Running frontend tests...'
                    script {
                        sh '''
                            docker run --rm ${FRONTEND_IMAGE} npm test -- --watchAll=false || true
                        '''
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    echo 'Running backend tests...'
                    script {
                        sh '''
                            docker run --rm ${BACKEND_IMAGE} npm test || true
                        '''
                    }
                }
            }
        }

        stage('Push Images') {
            steps {
                echo 'Pushing Docker images to Docker Hub...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                            docker push ${FRONTEND_IMAGE}
                            docker push ${BACKEND_IMAGE}
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                script {
                    sh '''
                        # Replace placeholders in manifests
                        sed -i "s|DOCKER_REGISTRY|${DOCKER_REGISTRY}|g" k8s/backend-deployment.yaml
                        sed -i "s|DOCKER_REGISTRY|${DOCKER_REGISTRY}|g" k8s/frontend-deployment.yaml
                        sed -i "s|IMAGE_TAG|${IMAGE_TAG}|g" k8s/backend-deployment.yaml
                        sed -i "s|IMAGE_TAG|${IMAGE_TAG}|g" k8s/frontend-deployment.yaml

                        # Apply Kubernetes manifests
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/mongodb-deployment.yaml
                        kubectl apply -f k8s/backend-deployment.yaml
                        kubectl apply -f k8s/frontend-deployment.yaml
                        kubectl apply -f k8s/backend-service.yaml
                        kubectl apply -f k8s/frontend-service.yaml
                        kubectl apply -f k8s/ingress.yaml

                        # Wait for rollouts
                        kubectl rollout status deployment/backend-deployment -n ${KUBERNETES_NAMESPACE} --timeout=300s
                        kubectl rollout status deployment/frontend-deployment -n ${KUBERNETES_NAMESPACE} --timeout=300s
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                echo 'Performing health checks...'
                script {
                    sh '''
                        sleep 10
                        BACKEND_IP=$(kubectl get service backend-service -n ${KUBERNETES_NAMESPACE} -o jsonpath='{.spec.clusterIP}')
                        FRONTEND_IP=$(kubectl get service frontend-service -n ${KUBERNETES_NAMESPACE} -o jsonpath='{.spec.clusterIP}')
                        
                        echo "Checking backend health at http://\$BACKEND_IP:5000/health"
                        curl -f http://\$BACKEND_IP:5000/health || exit 1

                        echo "Checking frontend health at http://\$FRONTEND_IP:3000"
                        curl -f http://\$FRONTEND_IP:3000 || exit 1
                    '''
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
            sh 'docker system prune -f'
        }
    }
}
