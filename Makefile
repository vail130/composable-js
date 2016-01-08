KARMA=node_modules/.bin/karma
DOCCO=node_modules/.bin/docco
UGLIFY=node_modules/.bin/uglifyjs
ESLINT=node_modules/.bin/eslint

default: test

install:
	npm install

lint:
	$(ESLINT) composable.js

test:
	@NODE_ENV="test" $(KARMA) start ./test/karma.conf.js
	make lint

build:
	$(DOCCO) composable.js
	$(UGLIFY) composable.js -m --source-map composable.min.map -o composable.min.js

.PHONY: test
