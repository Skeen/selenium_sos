#!/bin/bash

if [ "$#" -lt 4 ]; then
	echo "Expected 4 args: target_file output_name browser channel ambient? Desc? RandWait? Private?" 1>&2
	exit
fi
TARGETS=$(cat $1)

SET_NAME="${2}"

CHANNEL="${4}"

BROWSER="${3}"

AMBIENT="${5}"

META_DESC=""
RANDWAIT=""
PRIVATE="${8}"

DIFFICULTY=$(node calibrate.js $BROWSER $CHANNEL)

# Include description if provided
if [ "$#" -ge 6 ]; then
	META_DESC="${6}"
fi
if [ "$#" -ge 7 ]; then
	RANDWAIT="${7}"
fi

for i in {0..9}
do
	for SITE in ${TARGETS[@]}
	do
		echo "node tor.js $BROWSER ${SITE} \"/${SET_NAME}/$(basename ${SITE})_${i}\" $CHANNEL $DIFFICULTY ${AMBIENT:-0} $META_DESC $RANDWAIT ${PRIVATE:-0}"
	done
done
