Create a yml file:
```yml
name: Npm Publish

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  Npm-Publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.4

      - name: Install Deps
        run: yarn install

      - name: publish with latest tag
        uses: JS-DevTools/npm-publish@v1
        with:
          token: ${{ secrets.NPM_AUTH_TOKEN }}
```
Package.json add release script (example):
```json
{
  "scripts": {
    "prepublishOnly": "tsc",
    "release": "standard-version"
  },
  "dependencies": {
    "typescript": "^4.3.5"
  },
  "devDependencies": {
    "standard-version": "^9.3.1"
  }
}
```
Log in to npm:
[Npm](https://www.npmjs.com/)
Log in to the account, access token generates a new token, and select permission to publish package. Copy the token.
Select settings-> secrets in the github repository to create a secret with the name NPM_AUTH_TOKEN and the value token that you just copied
If git pushes tag like v0.0.1, it will trigger automatic release.