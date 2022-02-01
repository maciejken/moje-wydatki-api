pipeline {
  agent any
  stages {
    stage('docker build') {
      environment {
        APP_VERSION = sh script: "npm run version", returnStdout: true
        APP_IMAGE_TAG = APP_VERSION[-6..-1]
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