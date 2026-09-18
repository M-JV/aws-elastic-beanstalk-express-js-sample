pipeline {
    agent any

    stages {
        stage('Environment') {
            steps {
                sh '''
                    docker run --rm node:16 node --version
                    docker run --rm node:16 npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    docker run --rm \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        node:16 \
                        npm ci
                '''
            }
        }

        stage('Test Application') {
            steps {
                sh '''
                    docker run --rm \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        node:16 \
                        npm test
                '''
            }
        }

        stage('Security Scan') {
            steps {
                withCredentials([string(credentialsId: 'snyk-api-token', variable: 'SNYK_TOKEN')]) {
                    sh '''
                        docker run --rm \
                            -e SNYK_TOKEN="$SNYK_TOKEN" \
                            -v "$WORKSPACE:/app" \
                            -w /app \
                            snyk/snyk:node \
                            snyk test --severity-threshold=high
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                        -t mejova/isec6000-node-app:${BUILD_NUMBER} \
                        -t mejova/isec6000-node-app:latest \
                        .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | docker login \
                            -u "$DOCKERHUB_USERNAME" \
                            --password-stdin

                        docker push mejova/isec6000-node-app:${BUILD_NUMBER}
                        docker push mejova/isec6000-node-app:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Archive Build Metadata') {
            steps {
                sh '''
                    echo "Jenkins Build: ${BUILD_NUMBER}" > build-metadata.txt
                    echo "Git Commit: ${GIT_COMMIT}" >> build-metadata.txt
                    echo "Docker Image: mejova/isec6000-node-app:${BUILD_NUMBER}" >> build-metadata.txt
                    echo "Latest Image: mejova/isec6000-node-app:latest" >> build-metadata.txt
                '''

                archiveArtifacts artifacts: 'build-metadata.txt',
                                 fingerprint: true
            }
        }
}

    post {
        always {
            echo 'Pipeline execution completed.'
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Review the stage logs above.'
        }
    }
}
