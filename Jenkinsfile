pipeline {
    agent{
       label 'host'
    }
    stages{
        stage('Checkout') { // for display purposes
            // Get some code from a GitHub repository
            steps{
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'gitee', url: 'https://gitee.com/joesupper/service-mars-call.git']]])
            }
            
        }
        stage('Build') {
            steps{
                // Run the maven build
              sh 'cd /var/jenkins/workspace/service-mars-call && cnpm install && npm run build && git describe > ./build/git.version'
              
              
            }
          
       }
       stage('Upload') {
           steps{
               
              script{
                  def pos_tag = sh returnStdout: true, script: 'git describe'
                  env.PROJECT_VERSION = pos_tag.trim()
                  docker.withRegistry("http://registry-vpc.cn-hangzhou.aliyuncs.com", "aliyun-docker-repo"){
                        docker.build('sumang/service-mars-call:${PROJECT_VERSION}').push(env.PROJECT_VERSION)
                    }
              }
           }
           
       }

       stage('Deploy') {
            steps{
              sh "sshpass -p RSn-KhU-p4S-WKV ssh -o StrictHostKeyChecking=no root@47.99.1.46 'kubectl set image deployment/staging-service-mars-call-deployment staging-service-mars-call-deployment=registry-vpc.cn-hangzhou.aliyuncs.com/sumang/service-mars-call:${PROJECT_VERSION}'"
            }
          
       }
        
    }

}
