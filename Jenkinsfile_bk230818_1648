pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "http://192.168.40.200:57777" // Docker Harbor 레지스트리 URL
        DOCKER_Harbor_path = "192.168.40.200:57777" // Docker Harbor push 경로
        DOCKER_CREDENTIALS_ID = "Harbor" // Jenkins에 등록된 Harbor 자격 증명 ID
        #IMAGE_NAME = "react:latest" // 이미지 이름 및 태그
        IMAGE_NAME = "react:1.0" // 이미지 이름 및 태그
        GIT_REPO_URL = "git@192.168.40.200:devteam/web-server.git" // GitLab 레포지토리 URL
        ARGOCD_SERVER = "http://211.183.3.130:31331" // ArgoCD 서버 URL
        REPO_PATH = "web-server" // GitLab repo name
    }
    
    stages {
        stage('git scm update') {
            steps {
                git url: "${GIT_REPO_URL}", branch: 'master'
            }
        }
        
        stage('Docker Build and Push') {
            steps {
                script {
                    def dockerImage = docker.build("${DOCKER_Harbor_path}/${REPO_PATH}/${IMAGE_NAME}", "-f Dockerfile .")
                    docker.withRegistry("${DOCKER_REGISTRY}", DOCKER_CREDENTIALS_ID) {
                        sh "docker push ${DOCKER_Harbor_path}/${REPO_PATH}/${IMAGE_NAME}" // 이미지를 Docker Harbor에 푸시
                    }
                }
            }
        }
        
//        stage('ArgoCD Deployment') {
//           steps {
//                script {
//                  sh "ssh 192.168.40.100 kubectl delete -f ."
//                  sh "kubectl apply -f ."
//                }
//            }
//        }
    }
    
}
