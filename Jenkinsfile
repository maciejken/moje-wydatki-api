pipeline {
  agent {
    node { label 'built-in' }
  }
  stages {
    stage('docker build') {
      steps {
        script {
          def VERSION_STDOUT = sh script: "npm run version", returnStdout: true
          def IMAGE_TAG = VERSION_STDOUT[-6..-1] + "." + $BUILD_NUMBER
          echo IMAGE_TAG
          sh "docker build . -t ${IMAGE_TAG}"
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