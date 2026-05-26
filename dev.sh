#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
set -e
cd $DIR

ARGS=("$@")
if [ $# -gt 0 ]; then
  run() { ./sh/comDev.sh "${ARGS[@]}"; }
else
  run() { ./sh/dev.sh; }
fi

until run; do
  echo "启动失败，1秒后重试..."
  sleep 1
done
