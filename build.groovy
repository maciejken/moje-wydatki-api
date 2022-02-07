pipeline {
  agent any
  parameters {
    string(name: "ALLOWED_USERS")
  }
  environment {
    ALLOWED_USERS = "${params.ALLOWED_USERS}"
    APP_VERSION = "${sh(script: 'npm run -s log:version', returnStdout: true).trim()}_${BUILD_NUMBER}"
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
      environment {
        DB_USER = credentials('postgres-db-user-qa')
        DB_PASSWORD = credentials('postgres-db-password-qa')
        DB_PATH = credentials('postgres-db-path-qa')
      }
      steps {
        sh 'docker-compose -f compose.qa-build.yml up -d'
      }
    }
    stage('deploy PROD') {
      when { branch 'main' }
      environment {
        DB_USER = credentials('postgres-db-user')
        DB_PASSWORD = credentials('postgres-db-password')
        DB_PATH = credentials('postgres-db-path')
      }
      steps {
        sh 'docker-compose -f compose.prod-build.yml up -d'
      }
    }
  }
  post {
    cleanup {
      cleanWs()
    }
  }
}