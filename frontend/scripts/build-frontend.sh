#!/bin/bash

source node_modules/.bin/vercel-is-pull-request --auth $1
source ./scripts/export-pr-number.sh
npm run build
# ./scripts/wait-on-api.sh
