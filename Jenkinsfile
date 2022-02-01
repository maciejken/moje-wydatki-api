pipeline {
  agent any
  stages {
    stage('docker build') {
      environment {
        APP_IMAGE_TAG = sh(script: "npm run version", returnStdout: true)[-6..-1]
      }
      steps {
        sh "docker build . -t moje_wydatki_api:${APP_IMAGE_TAG}"
      }
    }
    stage('docker run') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}