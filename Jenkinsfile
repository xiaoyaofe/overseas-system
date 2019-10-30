pipeline {
    agent any
    stages {
        stage('BUILD') {
            agent { docker {
                image 'reg.royale.com/ops/xynode:8-alpine'
                args '-v /data/jenkins/data/workspace/prod-build-frontend-oas:/data/app'
            }}
            steps {
                script {
                    try {
                        sh 'rm -rf node_modules dist'
                        sh 'npm install'
                        sh 'npm run build'
                        sh 'rm -rf /data/app/dist ; cp -rf dist /data/app/'
                    } catch(err) {
                        echo 'npm build error'
                        sh '/bin/sh ansible/notify.sh "npm install error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                        sh 'exit 1'
                    }
                }
            }
        }
        stage('PACKAGE') {
            steps {
                script {
                    try {
                        sh '''
                            filename=oas-$(date '+%Y%m%d%H%M%S').zip
                            cd dist && zip -qr ${filename} *
                            cd ..
                        '''
                    } catch(err) {
                        echo 'package error'
                        sh '/bin/sh ansible/notify.sh "package error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                        sh 'exit 1'
                    }
                }
            }
        }
        stage('DEPLOY') {
            steps {
                script {
                    try {
                        sh '''
                            src_file=$(ls -rht dist/oas-*.zip | head -n 1)
                            dest_file=/data/server_new/${src_file#dist/}
                            dt=$(date '+%Y%m%d%H%M%S')
                            ansible-playbook -i ansible/hosts ansible/deploy.yml -v --extra-var "src_file=$(pwd)/${src_file} dest_file=${dest_file} arch_file=oas-${dt}.zip"
                            /bin/sh ansible/notify.sh "deploy success" "${JOB_NAME}" "${BUILD_NUMBER}"
                        '''           
                    } catch(err) {
                        echo 'update error'
                        sh '/bin/sh ansible/notify.sh "deploy error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                        sh 'exit 1'     
                    }
                }
            }
        }
        stage('CHECK') {
            steps {
                script {
                    sh '''
                        if curl -I http://oas.pocketgamesol.com 2>&1 | grep -q 200 ; then
                            /bin/sh ansible/notify.sh "check success" "${JOB_NAME}" "${BUILD_NUMBER}"
                        else
                            /bin/sh ansible/notify.sh "http://oas.pocketgamesol.com cannot access" "${JOB_NAME}" "${BUILD_NUMBER}"
                        fi
                    '''
                }
            }
        }
    }
}