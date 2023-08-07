#!/bin/bash

starttime=$(date +%s.%N)

#find $1 -name '*.json' | xargs jq -c . .

for f in $(find $1 -name '*.json'); do
  echo $f;
  jq -c < $f > $f.tmp && mv $f.tmp $f;
done

endtime=$(date +%s.%N)
runtime=$(echo "$startime $endtime" | awk '{print $1 - $2}')
echo $runtime
