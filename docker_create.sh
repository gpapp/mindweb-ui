#!/bin/bash
## This snippet is used by the build script to create container specific to the project

docker create -P --name mw-ui-$TYPE \
    --env TYPE=${TYPE} \
    mindweb/ui
