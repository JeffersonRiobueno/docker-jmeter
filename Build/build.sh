#!/bin/bash

JMETER_VERSION="5.6.3"
IMAGE_TIMEZONE="America/Lima"

# Example build line
docker build  --build-arg JMETER_VERSION=$JMETER_VERSION --build-arg TZ=$IMAGE_TIMEZONE -t "riobueno/jmeter:$JMETER_VERSION" .
