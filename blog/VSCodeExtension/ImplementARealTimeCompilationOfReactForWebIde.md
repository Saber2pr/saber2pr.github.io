# Background
The typescript compiler is written by typescript, so it can be run on the browser side. Monaco-editor is an ide editor kernel that can be run on the web side. Therefore, the front-end code development + compilation can be implemented on the browser side without server support.
# Value
It is more convenient to develop some simple H5/RN pages, implement SDK business library playground function, encapsulate business logic support special modules such as editor integrated internal login system, and realize one-click release and deployment of uploading resources by calling cloud services.
# Technical principle
## 1. Basic concepts of monaco-editor
The vscode architecture diagram is as follows:
![](https://delftswa.gitbooks.io/desosa-2017/content/vscode/images-vscode/development-view-overview.png)
It is composed of built-in type definition, multi-platform initiator and vscode core layer.
The vscode core layer consists of the following parts:
-base layer basic layer: provides common basic tools and user interfaces
-platform layer platform layer: provides service injection capabilities and basic services
-UI layer of workbench layer interface: UI module is implemented by Electron.
-editor layer editor layer: monaco-editor
Monaco-editor was originally implemented as the editor layer at the core of vscode, and later became independent.
### Installation and use
Need to install monaco-editor and monaco-editor-webpack-plugin at the same time
```sh
yarn add monaco-editor
yarn add monaco-editor-webpack-plugin -D
```
Monaco-editor-webpack-plugin needs to be configured to webpack plugins.
### Editor
Editor is an editor that supports code highlighting, syntax hints / checks, command panels, etc., which is basically the same as the vscode code editor.
Create an editor:
```tsx
// 使用 `monaco.editor.create` 来创建一个编辑器，
const editor = monaco.editor.create(document.querySelector('#root'), {
  value: "function hello() {\n\talert('Hello world!');\n}",
  language: 'javascript',
})
```
This only supports editing of one file. If you want to implement tabs of multiple files such as vscode, you need to use model:
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
Editor can also switch model (the currently edited file), that is, the tab switch of vscode
```tsx
// 使用setModel切换当前编辑的文件
editor.setModel(fileModel2)
```
Here's the setModel docking vscode side explorer file tree click File Edit.
2. DiffEditor
DiffEditor is an editor that supports text difference comparison, which is mostly used to view the contents of file changes, such as git diff.
Before creating a comparison, create two files, model:
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
Then create a diff editor:
```tsx
const diffEditor = monaco.editor.createDiffEditor(container)
diffEditor.setModel({
  original: originalFileModel,
  modified: modifiedFileModel,
})
```
4. Language
Monaco-editor comes with compilers of html, css, javascript, typescript, and json. Compilers of various languages can be obtained through monaco.languages, such as typescript compiler to compile tsx code:
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
5. Options
Set the compilation options for the built-in ts compiler tsconfig:
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
6. Typescript ExtraLib
If you want to add a global d.ts file, you can use the addExtraLib method:
```tsx
const typescriptDefaults = monaco.languages.typescript.typescriptDefaults

typescriptDefaults.addExtraLib(`declare module "react" {  }`, 'react.d.ts')
```
## 3. Load npm packages from cdn with the help of AMD module specification
The amd specification allows you to load module resources from http, such as using requirejs to load axios:
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
Using monaco-editor to configure tsconfig, you can compile the ts code into the amd module, and then configure the module to load the amd/umd resource http path. The premise is that the npm package you need to use has released the umd version.