#!/bin/sh
IP=$(ip addr show dev eth0 | awk '/inet / {print $2}'| cut -d/ -f1)
VALUE='{"name":"ui","path":"*","authorized":false,"host":"'$IP'","port":"2003","url":"http://'$IP':2003/file"}'
watch -n5 -x curl http://192.168.1.20:2379/v2/keys/mindweb/${TYPE}/services/ui -XPUT \
  -d ttl=5 \
  -d value=${VALUE}