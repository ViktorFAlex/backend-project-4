install:
	npm ci
lint:
	npx eslint
gendiff:
	node bin/pageLoader.js
publish:
	npm publish --dry-run
test:
	npm test
test-coverage:
	npm test -- --coverage --coverageProvider=v8
