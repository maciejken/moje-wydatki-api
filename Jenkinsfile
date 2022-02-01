pipeline {
  agent {
    node { label 'built-in' }
  }
  stages {
    stage('docker build') {
      steps {
        def APP_VERSION = sh script: "npm run version", returnStdout: true
        echo APP_VERSION
        // sh "docker build -t moje_wydatki_api ."
      }
    }
    stage('docker run') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}