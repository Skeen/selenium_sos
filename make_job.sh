#!/bin/bash

if [ "$#" -lt 4 ]; then
	echo "Expected 4 args: target_file output_name browser channel" 1>&2
	exit
fi
TARGETS=$(cat $1)

SET_NAME="${2}"

CHANNEL="${4}"

BROWSER="${3}"

AMBIENT="${5}"

META_DESC=""

DIFFICULTY=$(node calibrate.js $BROWSER $CHANNEL)

# Include description if provided
if [ "$#" -ge 6 ]; then
	META_DESC="${6}"
fi

for i in {1..30}
do
	for SITE in ${TARGETS[@]}
	do
		echo "node index.js $BROWSER ${SITE} \"/${SET_NAME}/$(basename ${SITE})_${i}\" $CHANNEL $DIFFICULTY ${AMBIENT:-0} $META_DESC"
	done
done
