#!/usr/bin/env bash


if [ ! -d "node_modules" ]; then
  bun i
fi

./sh/env.js
