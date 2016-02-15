#!/usr/bin/env bash

CURRENT_DIR=`dirname $0`/..
pushd ${CURRENT_DIR}

function reset_current_directory {
  popd
}
trap reset_current_directory EXIT

OLD_VERSION=$1
NEW_VERSION=$2

if [ -z ${OLD_VERSION} ] || [ -z ${NEW_VERSION} ]; then
	echo "Usage: ./update-version OLD_VERSION NEW_VERSION"
	exit 1
fi

COMPONENT_JSON=${CURRENT_DIR}/component.json
PACKAGE_JSON=${CURRENT_DIR}/package.json
COMPOSABLE_JS=${CURRENT_DIR}/composable.js

echo "Validating old version"

if [[ -z `egrep "\"version\":[[:space:]]+\"${OLD_VERSION}\"" ${COMPONENT_JSON}` ]]; then
	echo "Old version mismatch in ${COMPONENT_JSON}"
	exit 1
fi
if [[ -z `egrep "\"version\":[[:space:]]+\"${OLD_VERSION}\"" ${PACKAGE_JSON}` ]]; then
	echo "Old version mismatch in ${PACKAGE_JSON}"
	exit 1
fi
if [[ -z `egrep "Composable.VERSION[[:space:]]+=[[:space:]]+('|\")${OLD_VERSION}('|\");" ${COMPOSABLE_JS}` ]]; then
	echo "Old version mismatch in ${COMPOSABLE_JS}"
	exit 1
fi

echo "Changing version from ${OLD_VERSION} to ${NEW_VERSION}"

sed -i '' -E \
	-e "s/\"version\":[[:space:]]+\"${OLD_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" \
	${COMPONENT_JSON}
sed -i '' -E \
	-e "s/\"version\":[[:space:]]+\"${OLD_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" \
	${PACKAGE_JSON}
sed -i '' -E \
	-e "s/Composable.VERSION[[:space:]]+=[[:space:]]+('|\")${OLD_VERSION}('|\");/Composable.VERSION = '${NEW_VERSION}';/" \
	${COMPOSABLE_JS}
