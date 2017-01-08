#!/bin/bash

TO_REMOVE=$(cat $1)
INPUT_FILE=$2

cat $INPUT_FILE | grep -v "${TO_REMOVE}"
