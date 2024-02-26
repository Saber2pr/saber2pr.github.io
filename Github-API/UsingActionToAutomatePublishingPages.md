```ts
name: Github Pages
on:
  workflow_dispatch:
  push:
    branches:
      - master
jobs:
  Deploy-Pages:
    runs-on: ubuntu-18.04
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Install Deps
        run: yarn install

      - name: Build App
        run: yarn build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build

```
1. The prefix `-` represents an array element, and the content of the element ends with the next `-`.
2. GITHUB_TOKEN in secrets.GITHUB_TOKEN is a default token, which does not require additional configuration.