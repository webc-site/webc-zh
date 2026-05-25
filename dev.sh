#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -e

if [ $# -gt 0 ]; then
  ./sh/comDev.sh $@
else
  ./sh/dev.sh
fi
