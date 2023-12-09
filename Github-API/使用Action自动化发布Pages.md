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

1. 带 `-` 前缀的表示一个数组元素，元素内容到下一个 `-` 为止。

2. secrets.GITHUB_TOKEN 中的 GITHUB_TOKEN 是预设的 token，不需要额外配置就有。
