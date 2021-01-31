#!/bin/bash
#
# Run JMeter Docker image with options

NAME="jmeter2"
IMAGE="riobueno/jmeter:5.1.1"

# Finally run
sudo docker stop ${NAME} > /dev/null 2>&1
sudo docker rm ${NAME} > /dev/null 2>&1
sudo docker run --name ${NAME} -i -v ${PWD}:${PWD} -w ${PWD} ${IMAGE} $@
