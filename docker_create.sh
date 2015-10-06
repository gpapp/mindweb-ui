#!/bin/bash
## This snippet is used by the build script to create container specific to the project

docker create \
    -P -p 0.0.0.0:$HTTP_PORT \
    --env TYPE=${TYPE} \
    --volume `pwd`/../.config/$TYPE/ui/nginx:/etc/nginx/sites-enabled \
    --name mw-ui-$TYPE \
    mindweb/ui

if [ ! -d  ../.config/$TYPE/ui/nginx ]; then 
  mkdir -p ../.config/$TYPE/ui/nginx
  cp nginx/default ../.config/$TYPE/ui/nginx/default
fi
