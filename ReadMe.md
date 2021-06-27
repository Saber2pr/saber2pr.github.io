# [saber2pr.github.io](https://saber2pr.github.io/)

> saber2pr's blog.

```bash
git clone https://github.com/Saber2pr/saber2pr.github.io.git --depth=1

cd ./saber2pr.github.io

yarn install

yarn dev
```

# Feature

1. 前端路由

2. markdown 博客 + 树形目录

3. 响应式布局，PC 端移动端自适应

4. 更新日志生成

5. 支持 PWA 桌面离线应用

> 由于博客中的更新日志脚本需要对主分支修改记录 blog 旧的版本，所以暂时不准备使用 action 来部署。
> 只要支持/build、/blog、/static 下静态文件访问即可部署本程序

# Publish

```bash
# 编译项目
yarn build
```

```bash
# 生成更新日志
yarn update
```

# License

MIT

> Author: saber2pr
