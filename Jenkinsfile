pipeline {
  agent any
  stages {
    stage('docker build') {
      environment {
        APP_VERSION = "${sh(script: 'npm run -s version', returnStdout: true).trim()}"
      }
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