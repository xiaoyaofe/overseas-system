pipeline {
    agent { label 'ansible' }
    environment {
        project = "oas"
        ppath = "/data/packages/test/frontend"
        rpath = "/data/k8s/packages/test/frontend"
    }
    stages {
        stage('BUILD') {
            agent { docker {
                image 'reg.royale.com/ops/xynode:8-alpine'
                label 'jenkins-slave'
                args "-v ${ppath}:/data/app"
            }}
            steps {
                script {
                    try {
                        sh 'rm -rf node_modules dist'
                        sh 'npm install'
                        sh '''
                            npm run build
                            dt=$(date '+%Y%m%d')
                            mkdir -p /data/app/${project}/${dt}
                            rm -rf /data/app/${project}/${dt}/dist
                            cp -rf dist /data/app/${project}/${dt}/
                        '''
                    } catch(err) {
                        echo 'npm build error'
                        sh '/bin/sh ansible/notify.sh "npm build error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                    }
                }
            }
        }
        stage('DEPLOY') {
            steps {
                script {
                    try {
                        sh '''
                            workspace=$(pwd)
                            cd ${rpath}/${project}/$(date '+%Y%m%d')
                            cd dist
                            filename="${project}-$(date '+%Y%m%d%H%M%S').zip"
                            zip -qr ${filename} *
                            mv ${filename} ../
                            cd ../
                            rm -rf dist

                            cd ${workspace}/ansible
                            src_file="${rpath}/${project}/$(date '+%Y%m%d')/${filename}"
                            dest_file="/data/server_new/${filename}"
                            arch_file="${project}-$(date '+%Y%m%d%H%M%S').zip"
                            ansible-playbook -i hosts deploy.yml --extra-var "src_file=${src_file} dest_file=${dest_file} project=${project} arch_file=${arch_file}"
                            rm -f *.retry
                            /bin/sh notify.sh "deploy success" "${JOB_NAME}" "${BUILD_NUMBER}"
                        '''
                    } catch(err) {
                        echo 'deploy error'
                        sh '/bin/sh ansible/notify.sh "deploy error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                    }
                }
            }
        }
    }
    post {
        success {
            sh '''
                if curl -I http://oas-test.pocketgamesol.com 2>&1 | grep -q 200 ; then
                    /bin/sh ansible/notify.sh "http://oas-test.pocketgamesol.com check success" "${JOB_NAME}" "${BUILD_NUMBER}"
                else
                    /bin/sh ansible/notify.sh "http://oas-test.pocketgamesol.com cannot access" "${JOB_NAME}" "${BUILD_NUMBER}"
                fi
            '''
        }
    }
}
