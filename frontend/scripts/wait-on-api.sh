#!/bin/bash

if [[ ! -z "$NEXT_PUBLIC_PREVIEW_URL_PREFIX" && ! -z "$VERCEL_GIT_PULL_REQUEST_NUMBER" ]]; then 
  npm run wait-on -- $(echo $NEXT_PUBLIC_PREVIEW_URL_PREFIX)$(echo $VERCEL_GIT_PULL_REQUEST_NUMBER).up.railway.app/api/v1
elif [[ ! -z "$NEXT_PUBLIC_BASE_URL" ]]; then
  npm run wait-on -- $(echo $NEXT_PUBLIC_BASE_URL)/api/v1
fi
