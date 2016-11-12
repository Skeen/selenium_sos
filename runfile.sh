#!/bin/bash

if [ "$#" -ne 3 ]; then
	echo "Expected 3 args: target_file output_name browser"
	exit
fi
TARGETS=$(cat $1)

QUERY_NAME="${2}_qry"
REFNC_NAME="${2}_ref"


BROWSER="${3}"

for SITE in ${TARGETS[@]}
do
	for i in {1..10}
	do
	   echo "Running test: ${SITE} $i"
	   node index.js $BROWSER ${SITE} "/${QUERY_NAME}/${SITE}_${i}" 
	   node index.js $BROWSER ${SITE} "/${REFNC_NAME}/${SITE}_${i}"
	done
done
