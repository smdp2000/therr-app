#!/bin/bash

set -e

source _bin/lib/git.sh

if [ "$LAST_COMMIT_AUTHOR" = "$GIT_AUTHOR_TRAVIS" ]; then
  echo "Previous build committed by git author, $GIT_AUTHOR_TRAVIS. Skipping build stage."
else
  npm run build:all
fi