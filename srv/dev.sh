#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
. ../sh/pid.sh
set -x
exec bunx nodemon --watch lib --watch conf -e js,capnp --exec './sh/build.js && ./sh/workerd.sh'
