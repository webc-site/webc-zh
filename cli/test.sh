#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -x

rm -rf ~/.cache/webc.com
rm -rf tmp
mkdir -p tmp
echo '{"type": "module"}' >tmp/package.json
(cd tmp && ../src/cli.js i18n)
bunx vitest run test/compile.test.js
