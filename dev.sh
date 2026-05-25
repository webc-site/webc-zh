#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -e

. ./sh/pid.sh

PORT=5180

open_url() {
  local count=0
  while ! nc -z localhost $PORT; do
    if [ $count -ge 10 ]; then
      echo "Failed to connect to localhost:$PORT after $count seconds"
      return 1
    fi
    sleep 1
    count=$((count + 1))
  done
  open http://localhost:$PORT
}

open_url &

set -x

exec bun x vite
