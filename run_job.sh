#!/bin/bash

while true
do
	CMD=$(head -1 $1)
	if [ -z "${CMD}" ]; then
		echo "No more input"
		exit 0
	fi

	eval "${CMD}"
	sleep 1
	sed -i "1d" $1
done
