#!/bin/bash
## This snippet is used by the build script to create container specific to the project

docker create -P --name mw-ui-$TYPE \
    --env TYPE=${TYPE} \
    --volume `pwd`/../.config/$TYPE/ui/nginx:/etc/nginx/sites/enabled \
    mindweb/ui

if [ ! -d  ../.config/$TYPE/ui/nginx ]; then 
  mkdir -p ../.config/$TYPE/ui/nginx
  cp nginx/default ../.config/$TYPE/ui/nginx/default
fi
