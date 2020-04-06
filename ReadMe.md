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

# Publish

```bash
# 编译项目
yarn build
```

```bash
# 生成更新日志
yarn update
```

# Wiki Builder

项目支线为 Wiki 生成器，执行:

```bash
yarn dev:wiki

yarn build:wiki
```

即可进行调试和构建。

### wiki-builder usage

在 release 目录下生成的 js 和 css 引入 html 即可。(参考默认示例)

index.html 放到服务器根目录下。在/blog 目录中编写 mardown 文件，在/wiki 文件中编写 wiki 目录。(语法参考示例)

示例结构：

```bash
├── blog
│   ├── ALE
│   │   └── ALE_SOLID.md
│   ├── CONTROL
│   │   └── CONTROL_ALE.md
│   └── LS-DYNA_WIKI.md
├── index.html
└── wiki
```

> blog 目录下只允许一个 file 节点，其余都为一层的 dir 节点。

### 快速开始的模板

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <script src="https://saber2pr.top/loading/index.min.js"></script>
    <title>WIKI Name</title>
    <link
      href="https://saber2pr.top/MyWeb/js/wiki/wiki.min.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script>
      LOADING.init() // loading动画
    </script>
    <script
      type="text/javascript"
      src="https://saber2pr.top/MyWeb/js/wiki/wiki.min.js"
    ></script>
  </body>
</html>
```

# License

MIT

> Author: saber2pr
