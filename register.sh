#!/bin/sh
service nginx start &
IP=$(ip addr show dev eth0 | awk '/inet / {print $2}'| cut -d/ -f1)
VALUE='{"name":"ui","path":"*","authorized":false,"host":"'$IP'","port":"80","url":"http://'$IP'/"}'
while true; do
    curl http://192.168.1.20:2379/v2/keys/mindweb/${TYPE}/services/ui -XPUT \
        -d ttl=10 \
        -d value=${VALUE}
    sleep 5
done