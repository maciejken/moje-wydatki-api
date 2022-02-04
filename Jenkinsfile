pipeline {
  agent any
  environment {
    APP_VERSION = "${sh(script: 'npm run -s version', returnStdout: true).trim()}_${BUILD_NUMBER}"
  }
  stages {
    stage('install') {
      steps {
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
    stage('deploy QA') {
      when { branch 'develop' }
      steps {
        sh 'docker-compose -f docker-compose.qa.yml up -d'
      }
    }
    stage('deploy PROD') {
      when { branch 'main' }
      steps {
        sh 'docker-compose -f docker-compose.prod.yml up -d'
      }
    }
  }
  post {
    cleanup {
      cleanWs()
    }
  }
}