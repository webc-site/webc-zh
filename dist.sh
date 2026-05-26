#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -x

./sh/dist.sh

CUR_BRANCH=$(git branch --show-current)
if [ "$CUR_BRANCH" != "main" ]; then
  git checkout main
  git pull origin main
  git merge "$CUR_BRANCH" --no-edit
else
  git pull origin main
fi

git push origin main --tags
git push origin main

if [ "$CUR_BRANCH" != "main" ]; then
  git checkout "$CUR_BRANCH"
  git push
fi
