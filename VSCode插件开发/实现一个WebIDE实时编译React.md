# 背景

typescript 编译器由 typescript 编写，所以可在浏览器端运行。monaco-editor 是一个 web 端可运行的 ide 编辑器内核。所以可以在浏览器端实现前端代码开发+编译，不需要服务端支持。

# 价值

可以更方便地开发一些简单的 H5/RN 页面、实现 SDK 业务库 playground 功能、封装业务逻辑支持特殊模块如编辑器集成内部登录系统，实现调用云端服务上传资源一键发布部署。

# 技术原理

## 1. monaco-editor 基本概念

vscode 架构图如下：

![](https://delftswa.gitbooks.io/desosa-2017/content/vscode/images-vscode/development-view-overview.png)

由内置类型定义、多平台启动器、vscode 核心层组成。

其中 vscode 核心层由以下几个部分组成：

- base layer 基础层：提供通用的基础工具和用户接口
- platform layer 平台层：提供服务注入能力和基础服务
- workbench layer 界面 UI 层：由 Electron 实现 UI 模块。
- editor layer 编辑器层：即 monaco-editor

monaco-editor 最初是作为 vscode 核心的编辑器层实现，后续才独立出来。

### 安装使用

需要同时安装 monaco-editor 和 monaco-editor-webpack-plugin

```sh
yarn add monaco-editor
yarn add monaco-editor-webpack-plugin -D
```

monaco-editor-webpack-plugin 需要配置到 webpack plugins。

### editor

editor 是一个支持代码高亮、语法提示/检查、命令面板等的一个编辑器，和 vscode 代码编辑器基本一致。

创建一个编辑器：

```tsx
// 使用 `monaco.editor.create` 来创建一个编辑器，
const editor = monaco.editor.create(document.querySelector('#root'), {
  value: "function hello() {\n\talert('Hello world!');\n}",
  language: 'javascript',
})
```

这样只是支持一个文件的编辑，如果想实现多个文件如 vscode 的 tab，就需要用到 model：

```tsx
// 使用 `monaco.editor.createModel` 来创建一个model
// 每个文件都需要创建一个这样的model
const fileModel = monaco.editor.createModel(
  "function hello() {\n\talert('Hello world!');\n}",
  undefined, // language. infer from uri ext.
  monaco.Uri.file('main.js')
)

// 将model设置到editor
const editor = monaco.editor.create(document.querySelector('#root'), {
  model: fileModel,
  wordWrap: 'on', // 代码超过屏幕显示自动换行
})
```

editor 还可以切换 model（当前编辑的文件），即 vscode 的 tab 切换，

```tsx
// 使用setModel切换当前编辑的文件
editor.setModel(fileModel2)
```

这里的 setModel 对接 vscode 侧边资源管理器的文件树点击文件编辑。

2. diffEditor

diffEditor 是一个支持文本差异对比的编辑器，多用于文件变更内容的查看，如 git diff。

创建对比前，先创建两个文件 model：

```tsx
const originalFileModel = monaco.editor.createModel(
  "console.log('hello')",
  'javascript'
)
const modifiedFileModel = monaco.editor.createModel(
  "console.log('hello world')",
  'javascript'
)
```

然后创建一个 diff 编辑器：

```tsx
const diffEditor = monaco.editor.createDiffEditor(container)
diffEditor.setModel({
  original: originalFileModel,
  modified: modifiedFileModel,
})
```

4. language

monaco-editor 自带了 html、css、javascript、typescript、json 的编译器 worker，通过 monaco.languages 可以拿到各个语言的编译器，例如获取 typescript 编译器来编译 tsx 代码：

```tsx
// 创建一个tsx文件
const fileModel = monaco.editor.createModel(
  'const App = () => <div>hello</div>',
  undefined, // language. infer from uri ext.
  monaco.Uri.file('main.tsx')
)

// 获取ts编译器
monaco.languages.typescript.getTypeScriptWorker().then(async tsWorker => {
  const client = await tsWorker(fileModel.uri)
  // 获取文件编译后的内容
  const result = await client.getEmitOutput(fileModel.uri.toString())
  const files = result.outputFiles[0]
  return files.text
})
```

5. options

设置内置 ts 编译器的编译选项 tsconfig：

```tsx
const typescriptDefaults = monaco.languages.typescript.typescriptDefaults

typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit['React'],
  target: monaco.languages.typescript.ScriptTarget['ES5'],
  module: monaco.languages.typescript.ModuleKind['AMD'],
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  allowJs: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  downlevelIteration: true,
  removeComments: true,
  lib: ['dom', 'dom.iterable', 'esnext'],
})
```

6. typescript ExtraLib

如果想要添加一个全局 d.ts 文件，可以使用 addExtraLib 方法：

```tsx
const typescriptDefaults = monaco.languages.typescript.typescriptDefaults

typescriptDefaults.addExtraLib(`declare module "react" {  }`, 'react.d.ts')
```

## 3. 借助 AMD 模块规范从 cdn 加载 npm 包

amd 规范是可以从 http 加载模块资源的，例如使用 requirejs 加载 axios：

```js
require.config({
  paths: {
    axios: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
  },
})

require(['axios'], axios => {
  console.log(axios.get)
})
```

利用 monaco-editor 配置 tsconfig 可以将 ts 代码编译到 amd 模块，然后再配置模块加载 amd/umd 资源 http 路径即可。前提是需要使用的 npm 包发布了 umd 版本。
