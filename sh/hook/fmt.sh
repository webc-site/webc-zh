#!/usr/bin/env bash
set -ex

bun x oxfmt
bun x oxlint --fix
bun x knip-bun

# bun x svelte-check
