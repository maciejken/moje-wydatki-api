pipeline {
  agent any
  environment {
    APP_VERSION = "${sh(script: 'npm run -s version', returnStdout: true).trim()}_${BUILD_NUMBER}"
  }
  stages {
    stage('install') {
      steps {
        deleteDir()
        sh "npm install"
      }
    }
    stage('test') {
      steps {
        sh "npm test"
      }
    }
    stage('build image') {
      steps {
        sh "docker build . -t moje_wydatki_api:${APP_VERSION}"
      }
    }
    stage('start container') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
  post {
    always {
      cleanWs()
    }
  }
}