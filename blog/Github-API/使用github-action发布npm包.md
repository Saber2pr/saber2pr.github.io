创建yml文件：

```yml
name: Npm Publish

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  Npm-Publish:
    runs-on: ubuntu-18.04
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

package.json添加release脚本(示例)：

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

登陆npm：

[npm](https://www.npmjs.com/)

登陆账号，access token生成新token，选择权限可以发布package。复制token。

github仓库选择 settings -> secrets，创建secret，名称为NPM_AUTH_TOKEN，值为刚复制的token

git推送tag类似v0.0.1，就会触发自动发布
