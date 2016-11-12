#!/bin/bash

if [ "$#" -ne 5 ]; then
	echo "Expected 5 args: target_file output_name browser channel difficulty"
	echo "Use 0 for Channel and Difficulty for defaults."
	exit
fi
TARGETS=$(cat $1)

QUERY_NAME="${2}_qry"
REFNC_NAME="${2}_ref"

CHANNEL="${4}"
DIFFICULTY="${5}"

BROWSER="${3}"

for SITE in ${TARGETS[@]}
do
	for i in {1..10}
	do
	   echo "Running test: ${SITE} $i"
	   node index.js $BROWSER ${SITE} "/${QUERY_NAME}/${SITE}_${i}" $CHANNEL $DIFFICULTY 
	   node index.js $BROWSER ${SITE} "/${REFNC_NAME}/${SITE}_${i}" $CHANNEL $DIFFICULTY
	done
done
