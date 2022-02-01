pipeline {
  agent {
    node { label 'built-in' }
  }
  stages {
    stage('docker build') {
      steps {
        echo APP_VERSION=$(npm run version) > env.properties
        sh "docker build -t moje_wydatki_api ."
      }
    }
    stage('docker run') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}