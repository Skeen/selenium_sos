#!/bin/bash

BROWSER="chrome"

QUERY_NAME="chrome_event_loop_qry"
REFNC_NAME="chrome_event_loop_ref"

TARGETS=(http://skeen.website:3001 http://www.au.dk http://www.google.dk http://stroustrup.com http://www.youtube.com)

for SITE in ${TARGETS[@]}
do
	for i in {1..10}
	do
	   echo "Running test: ${SITE} $i"
	   node index.js $BROWSER ${SITE} "/${QUERY_NAME}/${SITE}_${i}" 
	   node index.js $BROWSER ${SITE} "/${REFNC_NAME}/${SITE}_${i}"
	done
done
