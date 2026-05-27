#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -x

./sh/build.js
exec mise exec -- bun --bun x vitest run "$@"
