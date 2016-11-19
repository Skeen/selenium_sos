#!/bin/bash

if [ "$#" -lt 4 ]; then
	echo "Expected 4 args: target_file output_name browser channel"
	exit
fi

TARGETS=$(cat $1)

SET_NAME="${2}"

CHANNEL="${4}"

BROWSER="${3}"

AMBIENT="${5}"

DIFFICULTY=$(node calibrate.js $BROWSER $CHANNEL)


for SITE in ${TARGETS[@]}
do
	for i in {1..30}
	do
		echo "node index.js $BROWSER ${SITE} \"/${SET_NAME}/$(basename ${SITE})_${i}\" $CHANNEL $DIFFICULTY ${AMBIENT:-0}"
	done
done
