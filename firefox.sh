#!/bin/bash

for i in {1..10}
do
   echo "Running test: $i"
   node index.js
   node index2.js
done
