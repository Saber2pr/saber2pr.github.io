# [saber2pr.github.io](https://saber2pr.github.io/)

> my web-page.

```bash
git clone https://github.com/Saber2pr/saber2pr.github.io.git

cd ./saber2pr.github.io

npm install

npm run dev
```

> npm 和 yarn 类似

# Feature

1. 前端路由无请求

2. markdown 解析器(支持语法高亮)

3. 响应式布局

# Dev

```bash
# 只编译，不启动服务
yarn start

# 启动server, 热更新
yarn run dev
```

# Publish

```bash
# 解析编译markdown，并更新数据
yarn run update

# 编译项目(release)
yarn run build
```

# Notice

build 命令会执行 scripts/cp.sh 脚本，可忽略 cp.sh。

# License

MIT

> Author

> saber2pr
