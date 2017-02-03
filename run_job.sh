#!/bin/bash

NAME=$1

while true
do
	CMD=$(head -1 $1)
	if [ -z "${CMD}" ]; then
		echo "No more input"
		exit 0
	fi

	eval "${CMD}" || echo ${CMD} >> ${NAME}.fail
	sed -i "1d" $1
	rm "tmp/.com.*" -rf
	rm "tmp/.org.*" -rf
done
