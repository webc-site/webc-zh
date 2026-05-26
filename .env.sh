#!/usr/bin/env bash

if [ ! -d node_modules ]; then
  bun i
  ./sh/init.js
fi

./sh/env.js
