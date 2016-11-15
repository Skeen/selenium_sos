#!/bin/bash

if [ "$#" -ne 4 ]; then
	echo "Expected 4 args: target_file output_name browser channel"
	exit
fi
TARGETS=$(cat $1)

QUERY_NAME="${2}_qry"
REFNC_NAME="${2}_ref"

CHANNEL="${4}"

BROWSER="${3}"

DIFFICULTY=$(node calibrate.js $BROWSER $CHANNEL)


for SITE in ${TARGETS[@]}
do
	for i in {1..20}
	do
	   echo "Running test: ${SITE} ${i} Channel:${CHANNEL} Difficulty:${DIFFICULTY}"
	   node index.js $BROWSER ${SITE} "/${QUERY_NAME}/${SITE}_${i}" $CHANNEL $DIFFICULTY 
	   node index.js $BROWSER ${SITE} "/${REFNC_NAME}/${SITE}_${i}" $CHANNEL $DIFFICULTY
	done
done
