#!/bin/bash

# Author: KK
# Version: 1.0

url="http://172.16.3.205:10000/sender/wechat?"
#tos="user1,user2"
<<<<<<< HEAD
tos="tao.wang"

#"PROJECT: ${JOB_NAME}&BUILD: ${BUILD_NUMBER}&URL: http://jenkins.royale.com/blue/organizations/jenkins/${JOB_NAME}/detail/${JOB_NAME}/${BUILD_NUMBER}/pipeline/"
=======
tos="zongjiang.ge,tao.wang,shindousaigo"

#"PROJECT: ${JOB_NAME}&BUILD: ${BUILD_NUMBER}&URL: http://jenkins2.royale.com/blue/organizations/jenkins/${JOB_NAME}/detail/${JOB_NAME}/${BUILD_NUMBER}/pipeline/"
>>>>>>> d3c1384eb3bcd0a1120e0539af3bb3c028cdc700

status=$1
job=$2
build=$3
<<<<<<< HEAD

content="STATUS: $status&PROJECT: ${job}&BUILD: ${build}&URL: http://jenkins.royale.com/blue/organizations/jenkins/${job}/detail/${job}/${build}/pipeline/"
=======
project=$(echo $job | awk -F'/' '{print $1}')
name=$(echo $job | awk -F'/' '{print $2}')
view=$(echo $project | awk -F'-' '{print $1"-"$2}')

content="STATUS: $status&PROJECT: ${job}&BUILD: ${build}&URL: http://jenkins2.royale.com/view/${view}/job/${project}/job/${name}/${build}/"
>>>>>>> d3c1384eb3bcd0a1120e0539af3bb3c028cdc700

curl -d "tos=$tos&content=$(echo $content | sed 's/&/\n/g')" $url 2>/dev/null
