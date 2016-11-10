#!/bin/bash

cat $1 | ./filter.sh "wget --spider -q --timeout=5 --tries=1" > $1_url
