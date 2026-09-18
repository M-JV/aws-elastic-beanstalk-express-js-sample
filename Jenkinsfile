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
                            snyk test
                    '''
                }
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
