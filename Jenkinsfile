pipeline {
  agent any
  parameters {
    string(name: "DB_PORT", defaultValue: "5432")
    string(name: "ALLOWED_USERS")
    string(name: "API_PREFIX", defaultValue: "/api")
    string(name: "CURRENCY", defaultValue: "PLN")
    string(name: "LOCALE", defaultValue: "pl-PL")
    string(name: "JWT_EXPIRES_IN", defaultValue: "15 minutes")
    string(name: "ROOT_DIR", defaultValue: "/app")
  }
  environment {
    APP_VERSION = "${sh(script: 'npm run -s version', returnStdout: true).trim()}_${BUILD_NUMBER}"
    DB_PATH = credentials('postgres-db-path')
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
      }
      steps {
        sh 'docker-compose -f docker-compose.qa.yml up -d'
      }
    }
    stage('deploy PROD') {
      when { branch 'main' }
      environment {
        DB_USER = credentials('postgres-db-user')
        DB_PASSWORD = credentials('postgres-db-password')
      }
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