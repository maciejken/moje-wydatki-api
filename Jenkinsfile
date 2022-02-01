pipeline {
  agent {
    node { label 'built-in' }
  }
  stages {
    stage('docker build') {
      steps {
        sh "echo ${$(npm run version)} > env.properties.APP_VERSION"
        echo $APP_VERSION
        echo env.APP_VERSION
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