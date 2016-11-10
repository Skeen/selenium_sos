#!/bin/bash

errcho(){>&2 echo $@; }

PREDICATE=$1

while IFS= read -r line; do
  if $PREDICATE "$line"; then echo "$line";
  else errcho "Rejected: ${line}"; fi
done
