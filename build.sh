#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

export NODE_ENV=${NODE_ENV:-dev}
./com.js
if command -v mise &>/dev/null; then
  mise exec -- bun x vite build $@
else
  bun x vite build $@
fi
