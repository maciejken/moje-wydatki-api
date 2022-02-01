pipeline {
  agent {
    node { label 'built-in' }
  }
  stages {
    stage('docker build') {
      steps {
        script {
          def VERSION_STDOUT = sh script: "npm run version", returnStdout: true
          def IMAGE_TAG = VERSION_STDOUT[-6..-1]
          sh "docker build . -t moje_wydatki_api:${IMAGE_TAG}"
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