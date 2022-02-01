pipeline {
  agent {
    node { label 'built-in' }
  }
  stages {
    stage('docker build') {
      steps {
        script {
          def VERSION_STDOUT = sh script: "npm run version", returnStdout: true
          def APP_VERSION = VERSION_STDOUT[-5..-1]
          echo APP_VERSION
          // sh "docker build -t moje_wydatki_api ."
        }
      }
    }
    stage('docker run') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}