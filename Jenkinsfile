pipeline {
  agent any
  environment {
    APP_VERSION = "${sh(script: 'npm run -s version', returnStdout: true).trim()}_${BUILD_NUMBER}"
  }
  stages {
    stage('docker build') {
      steps {
        sh "docker build . -t moje_wydatki_api:${APP_VERSION}"
      }
    }
    stage('docker run') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}