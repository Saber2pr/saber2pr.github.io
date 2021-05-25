运行时需要用到的包使用-save，否则使用-save-dev

生产环境用 cnpm install --save || cnpm i -S

开发环境用 cnpm install --save-dev || cnpm i -D

### 安装项目依赖包

1. 安装到 node_modules 目录

```bash
npm install [package]

npm i [package]

npm i [package] --registry=https://registry.npmjs.org
```

2. 把包安装到 node_modules 目录

会在 package.json 的 dependencies 属性下添加 package

```bash
npm install --save [package]
```

3. 把包安装到 node_modules 目录

会在 package.json 的 devDependencies 属性下添加 package

```bash
npm install --save-dev [package]
```

4. 全局安装 package

```bash
npm install -g [package]
```

### 删除依赖包

```bash
npm uninstall xxx
```

删除全局模块

```bash
npm uninstall -g xxx
```

### 删除已发布 npm 包

```bash
npx force-unpublish <packageName> 'message'
```

### 查看全局模块

```bash
npm list -g --depth 0
```

### 查看包远程库

```bash
npm config get registry
```

### 设置远程库

```bash
npm config set registry url
```

[npm]https://registry.npmjs.org/

[cnpm]https://registry.npm.taobao.org
