### 前言

本文在于给初次了解 ts 编译器的前端同学做一个初步引导，通过一系列由浅入深的示例后能够掌握 ts 编译器的基本使用，包括 ast 遍历，transform 函数编写等，同时对 ts-loader、ts-node 原理做一个简要分析。

### 1. 认识 ts compiler 之 createProgram 和 transpileModule

这两个函数可以说是 ts compiler 最主要的两个 api，它们都可以将 Typescript 代码转换成 JavaScript。

#### transpileModule

区别在于 transpileModule 只处理文本并且不会进行类型检查，它使用起来就是这样：

```ts
import ts from 'typescript'

// 直接生成对应js代码。即便ts类型有错误，它仍然能够生成代码。
const js = ts.transpileModule('/** 你的typescript代码 **/').outputText
```

> 到这里有经验的前端同学已经猜到 transpileOnly 的底层原理了，之前你可能想过全局@ts-ignore

这里可以给出一个 ts-loader 的最小实现（不保证能 work）:

```ts
import ts from 'typescript'

// 简易版ts-loader
function loader(this: webpack.LoaderContext<LoaderOptions>, contents: string) {
  const callback = this.async()
  // transpileOnly 只做类型擦除
  const result = ts.transpileModule(contents, {
    compilerOptions: {},
  })
  // 返回生成的js
  callback(null, result.outputText, null)
}
```

#### createProgram

那么 createProgram 是怎么工作的？createProgram 会扫描 typescript 文件的 import 等语句，遍历每个 ts 文件进行编译，同时会进行类型检查，将类型异常抛出并终止编译过程。它使用起来比 transpileModule 要复杂许多：

```ts
import ts from 'typescript/lib/typescript'

const compilerOptions = {}
// 创建一个文件读写服务（依赖nodejs）
const compilerHost = ts.createCompilerHost(compilerOptions)

// 创建编译程序
const program = ts.createProgram(['./entry.ts'], compilerOptions, compilerHost)

// 使用文件服务输出文件
program.emit()
```

这其实就是 tsc 命令底层做的事情。这里会发现 ts compiler 分出来一个 compilerHost，这个 compilerHost 是分装了文件写入、读取等操作。当然这里可以对 host 进行劫持修改，拦截文件的输出：

```ts
const compilerHost = ts.createCompilerHost(compilerOptions)

// 拦截获取文件
const originalGetSourceFile = compilerHost.getSourceFile
compilerHost.getSourceFile = fileName => {
  // 这里可以做类似webpack alias的事情
  console.log(fileName)
  return originalGetSourceFile.call(compilerHost, fileName)
}

// 拦截写入文件
compilerHost.writeFile = (fileName, data) => {
  // data就是编译生成的js代码
  console.log(fileName, data)
}
```

compilerHost 实现了将 compiler 和环境分离，compiler 本身只是一个编译器的实现，文件写入等操作可以作为一个 host 接口。

#### 在浏览器端使用 typescript compiler

有了这个环境分离基础，那么就可以实现在浏览器端运行 ts compiler！因为 ts compiler 本身编译后也是 js，只需要提供一个浏览器端的 compilerHost 就可以，typescript 官方提供了一个虚拟文件服务包@typescript/vfs 提供浏览器端兼容的 fs 服务：

```ts
import ts from 'typescript'
import tsvfs from '@typescript/vfs' // 虚拟文件服务
import lzstring from 'lz-string' // 一个压缩算法

// 从cdn创建上下文，包含了ts lib的类型库，从cdn拉取
const fsMap = await tsvfs.createDefaultMapFromCDN(
  compilerOptions,
  ts.version,
  true,
  ts,
  lzstring
)
// 可以设置一个虚拟的文件，文件名index.ts，文件内容第二个参数
fsMap.set('index.ts', '/** typescript 代码 **/')

const system = tsvfs.createSystem(fsMap)
// host是ts编译器将文件操作隔离出来的部分
// 这里可以创建一个虚拟的文件服务，不依赖nodejs，在浏览器中可用
const host = tsvfs.createVirtualCompilerHost(system, compilerOptions, ts)

// 创建编译程序
const program = ts.createProgram({
  rootNames: [...fsMap.keys()],
  options: compilerOptions,
  host: host.compilerHost,
})
```

#### ts-node 原理

经常使用 typescript 来开发的前端同学肯定用过 ts-node 来执行 ts 文件，有没有想过它的底层原理？

有了以上 ts 编译代码的基础，ts-node 做的事情应该就是：

```txt
读取 ts 文件，使用 transpileModule 函数转成 js，然后执行 eval
```

1. 但是 eval 函数它不安全，它可以修改全局上下文任何内容，在 nodejs 中 vm 模块提供了更安全的 runInThisContext 函数，可以控制可访问范围。

2. transpileModule 不会处理 import 语句来加载模块，ts-node 借用了 nodejs 自带的模块加载机制，重写了 require 函数加载：

```ts
import ts from 'typescript'

function registerExtension() {
  // require函数编译执行并加载ts文件
  // require到的是js执行返回的exports
  const old = require.extensions['.ts']

  // 定义ts加载函数
  require.extensions['.ts'] = function (m: any, filename) {
    // module自带的编译方法
    // 可以执行js获取exports变量，commonjs规范
    const _compile = m._compile

    // Module.prototype._compile方法，可以对js文件进行编译加载
    // 但是翻了文档并没有指出，只有看nodejs源码才知道
    // https://github.com/nodejs/node/blob/da0ede1ad55a502a25b4139f58aab3fb1ee3bf3f/lib/internal/modules/cjs/loader.js#L1065
    // https://github.com/nodejs/node/blob/da0ede1ad55a502a25b4139f58aab3fb1ee3bf3f/lib/internal/modules/cjs/loader.js#L1017
    // 底层原理是runInThisContext
    m._compile = function (code: string, fileName: string) {
      // 使用ts compiler对ts文件进行编译
      const result = ts.transpileModule(code, {
        compilerOptions: {},
      })
      // 使用默认的js编译函数获取返回值
      return _compile.call(this, result, fileName)
    }

    return old(m, filename)
  }
}
```

### 2. 认识 ts compiler 之 ast visitor

#### 遍历 ast

ts compiler 中的 ast 节点类型是 ts.Node。想要遍历一段 ts 代码的 ast，首先创建一个 sourceFile:

```ts
const file = ts.createSourceFile(
  `input.ts`,
  code,
  ts.ScriptTarget.ES2015,
  /*setParentNodes */ true
)
```

<!-- Todo -->

1. 遍历实现 getImports，提到 node fs walk

2. transform 函数，实现 noexcept

3. 流程图、时序图

4. 总结：ts-compiler 可以做什么，提取 imports、代码 codemod、自定义语法等
