pipeline {
  agent any
  environment {
    APP_VERSION = "${sh(script: 'npm run -s version', returnStdout: true).trim()}"
  }
  stages {
    stage('docker build') {
      steps {
        sh "docker build . -t moje_wydatki_api:${APP_VERSION}_${BUILD_NUMBER}"
      }
    }
    stage('docker run') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}