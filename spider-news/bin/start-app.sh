#!/bin/bash
set -e
arg="$@"
if [ -z $arg ] 
then
 echo "几把娃子先输入邮箱密码"
 exit 1
fi
export epwd=$1
nohup node news-science > news-science.log 2>&1 &
