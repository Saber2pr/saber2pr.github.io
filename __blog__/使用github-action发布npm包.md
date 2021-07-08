创建yml文件：

```yml
name: npm-publish

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  npm-publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: publish with latest tag
        uses: JS-DevTools/npm-publish@v1
        with:
          token: ${{ secrets.NPM_AUTH_TOKEN }}
```

登陆npm：

[npm](https://www.npmjs.com/)

登陆账号，access token生成新token，选择权限可以发布package。复制token。

github仓库选择 settings -> secrets，创建secret，名称为NPM_AUTH_TOKEN，值为刚复制的token

git推送tag类似v0.0.1，就会触发自动发布
