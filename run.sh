#!/bin/bash

BROWSER="firefox"

QUERY_NAME="multi_test_qry"
REFNC_NAME="multi_test_ref"

TARGETS=(skeen.website:3001 http://www.au.dk http://www.google.dk http://stroustrup.com http://www.youtube.com)

for SITE in ${TARGETS[@]}
do
	for i in {1..10}
	do
	   echo "Running test: ${SITE} $i"
	   node index.js $BROWSER ${SITE} "/${QUERY_NAME}/${SITE}_${i}" 
	   node index.js $BROWSER ${SITE} "/${REFNC_NAME}/${SITE}_${i}"
	done
done
