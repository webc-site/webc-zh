#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR/..
set -x

NEXT_VER=$(./sh/dist/nextVer.js)

pub() {
  local script=$1
  local conf_file=$2

  $script --ver $NEXT_VER
  local pkg=$(bun -e "import PKG from './conf/npm/${conf_file}.js';console.log(PKG)")
  (cd dist/$pkg && npm publish --access=public --registry=https://registry.npmjs.org/)
  ./sh/dist/npmVer.js --name $pkg --ver $NEXT_VER
}

pub ./sh/dist/cdn.js CDN_PKG
pub ./sh/dist/com.js COM_PKG
./sh/dist/readmeVer.js

git add .
git commit -m "v$NEXT_VER" || true

tag_ver() {
  local ver=$1
  if ! git rev-parse "v$ver" >/dev/null 2>&1; then
    git tag "v$ver"
  fi
}
tag_ver "$NEXT_VER"
