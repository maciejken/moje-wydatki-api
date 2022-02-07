pipeline {
  agent any
  parameters {
    booleanParam(name: "PROD_DEPLOY", defaultValue: false)
    string(name: "APP_VERSION")
    string(name: "ALLOWED_USERS")
  }
  environment {
    ALLOWED_USERS = "${params.ALLOWED_USERS}"
    APP_VERSION = "${params.APP_VERSION}"
    PROD_DEPLOY = "${params.PROD_DEPLOY}"
  }
  stages {
    stage('QA deploy') {
      when {
        expression { PROD_DEPLOY == 'false' }
      }
      environment {
        DB_USER = credentials('postgres-db-user-qa')
        DB_PASSWORD = credentials('postgres-db-password-qa')
        DB_PATH = credentials('postgres-db-path-qa')
      }
      steps {
        sh 'docker-compose -f compose.qa-deploy.yml up -d'
      }
    }
    stage('PROD deploy') {
      when {
        expression { PROD_DEPLOY == 'true' }
      }
      environment {
        DB_USER = credentials('postgres-db-user')
        DB_PASSWORD = credentials('postgres-db-password')
        DB_PATH = credentials('postgres-db-path')
      }
      steps {
        sh 'docker-compose -f compose.prod-deploy.yml up -d'
      }
    }
  }
  post {
    cleanup {
      cleanWs()
    }
  }
}