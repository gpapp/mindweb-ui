#!/bin/bash
## This snippet is used by the build script to create container specific to the project

NAME=$1

docker create \
    -P -p 0.0.0.0:$HTTP_PORT:80 \
    --env TYPE=${TYPE} \
    --env DB_PORT=${DB_PORT} \
    --env HTTP_PORT=${HTTP_PORT} \
    --env SERVER_PORT=${SERVER_PORT} \
    --volume `pwd`/../.config/$TYPE/ui/nginx:/etc/nginx/sites-enabled \
    --name ${NAME} \
    mindweb/ui

if [ ! -d  ../.config/$TYPE/ui/nginx ]; then 
  mkdir -p ../.config/$TYPE/ui/nginx
  cp nginx/default ../.config/$TYPE/ui/nginx/default
fi
