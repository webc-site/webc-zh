#!/usr/bin/env bash

if [ -z "$1" ]; then
  echo "Usage: $0 <component_name>"
  echo "Example: $0 Wait"
  exit 1
fi

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
. sh/pid.sh
PORT=1900
(
  for i in {1..30}; do
    if nc -z 127.0.0.1 $PORT; then
      open "http://127.0.0.1:$PORT/"
      break
    fi
    sleep 0.1
  done
) &

set -x
exec ./sh/demo.js $@ --port $PORT -i
