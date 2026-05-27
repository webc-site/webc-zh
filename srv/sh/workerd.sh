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

if [ ! -f "$BIN_PATH" ] || [ ! -f "$DIR/gen/srv.capnp" ]; then
  bun --insecure "$DIR/init.js"
fi

ulimit -n 10240 2>/dev/null || ulimit -n 4096 2>/dev/null || true
set -x
exec "$BIN_PATH" serve --experimental "$DIR/gen/srv.capnp"
