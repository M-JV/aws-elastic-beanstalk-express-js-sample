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
