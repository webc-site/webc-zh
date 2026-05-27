#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
. ../../sh/pid.sh
cd ..

BIN_PATH="bin/workerd"
if [ ! -d "node_modules" ]; then
  bun i
fi

if [ ! -f "$BIN_PATH" ]; then
  ./sh/init.js
fi

set -x

exec "$BIN_PATH" serve --experimental conf/workerd.capnp
