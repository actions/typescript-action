#!/bin/bash

# About:
# This is a helper script to tag and push a new release.
# GitHub Actions use release tags to allow users to select a specific version of the action to use.
# This script will do the following:
# 1. Get the latest release tag
# 2. Prompt the user for a new release tag (while displaying the latest release tag, and a regex to validate the new tag)
# 3. Tag the new release
# 4. Push the new tag to the remote

# Usage:
# script/release

# COLORS
OFF='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'

latest_tag=$(git describe --tags "$(git rev-list --tags --max-count=1)")

# if the latest_tag is empty, then there are no tags - let the user know
if [[ -z "$latest_tag" ]]; then
    echo -e "No tags found (yet) - continue to create your first tag and push it"
    latest_tag="[unknown]"
fi

echo -e "The latest release tag is: ${BLUE}${latest_tag}${OFF}"
read -r -p 'New Release Tag (vX.X.X format): ' new_tag

tag_regex='v[0-9]+\.[0-9]+\.[0-9]+$'
if echo "$new_tag" | grep -q -E "$tag_regex"; then
    echo -e "Tag: ${BLUE}$new_tag${OFF} is valid"
else
    echo -e "Tag: ${BLUE}$new_tag${OFF} is ${RED}not valid${OFF} (must be in vX.X.X format)"
    exit 1
fi

git tag -a "$new_tag" -m "$new_tag Release"

echo -e "${GREEN}OK${OFF} - Tagged: $new_tag"

git push --tags

echo -e "${GREEN}OK${OFF} - Tags pushed to remote!"
echo -e "${GREEN}DONE${OFF}"
