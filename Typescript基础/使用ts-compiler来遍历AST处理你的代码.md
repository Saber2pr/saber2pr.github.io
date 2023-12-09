### 前言

本文在于给初次了解 ts 编译器的前端同学做一个初步引导，通过一系列由浅入深的示例后能够掌握 ts 编译器的基本使用，包括 ast 遍历，transform 函数编写、表达式节点创建等，同时对 ts-loader、ts-node 原理做一个简要分析。本文侧重点在 transform 函数的编写上。

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

### 2. 认识 ts compiler 之 ast visitor、transformer

visitor 用来遍历 ast 树，transformer 用来对 ast 树做转换。在 ts 编译器 api 中区分为 forEachChild、visitEachChild，类似 forEach 和 map 的区别。

#### 使用 visitor 遍历 ast

ts compiler 中的 ast 节点类型是 ts.Node。想要遍历一段 ts 代码的 ast，首先创建一个 sourceFile:

```ts
// 创建ast根结点
const rootNode = ts.createSourceFile(
  `input.ts`,
  `/** typescript代码 **/`,
  ts.ScriptTarget.ES2015,
  /*setParentNodes */ true
)
```

ts 提供了 forEachChild 函数用来遍历 ast 节点的子节点：

```ts
// 遍历rootNode的子节点
ts.forEachChild(rootNode, node => {
  // ast节点上有一个kind属性表示类型
  console.log(node.kind)

  // 通常使用ts的类型守卫来区分节点类型：
  // 例如判断当前节点是否是import声明
  // node: ts.Node
  if (ts.isImportDeclaration(node)) {
    // node: ts.ImportDeclaration
    // 节点上有一个getText方法用来打印节点文本内容，用于调试
    console.log(node.getText())
  }
})
```

forEachChild 只会向下遍历一层，这里需要遍历整个 ast 树，所以需要进行递归遍历：

```ts
const traverse = (node: ts.Node) => {
  console.log(node.getText())
  // 递归遍历每个节点
  ts.forEachChild(node, node => traverse(node))
}
```

有了以上 visitor 的基础，就可以实现分析代码的 import 语句：

```ts
const traverse = (node: ts.Node) => {
  if (ts.isImportDeclaration(node)) {
    // 导入的包名或路径 moduleSpecifier模块标识
    const library = node.moduleSpecifier.getText()

    // 默认导入
    const defaultImport = node.importClause?.name?.getText()

    // 解构导入
    const bindings = node.importClause?.namedBindings as ts.NamedImports
    // names就是解构的变量名
    const names = bindings.elements.map(item => item.getText())
  }
  // 递归遍历
  ts.forEachChild(node, node => traverse(node))
}
```

这样就实现了单个文件的 import 获取，如果需要获取文件下所有代码的 import 可以使用 @nodelib/fs.walk 库来获取所有文件。

#### 使用 transformer 转换 ast

在 ts 编译器编译时，提供了一个 transform 接口用来修改 ast，createProgram 和 transpileModule 的 transform 接口如下：

```ts
// createProgram
const program = ts.createProgram(['input.ts'], options, compilerHost)
// 最后一个参数是 CustomTransformers
program.emit(undefined, undefined, undefined, undefined, transformers)

// transpileModule
// 第二个参数有transformers接口
ts.transpileModule(`/** typescript代码 **/`, { transformers })
```

transformers 是一个对象，提供了 3 个生命周期钩子，分别是编译前、编译时、编译后：

```ts
ts.transpileModule(`/** typescript代码 **/`, {
  transformers: {
    before: [], // before中的transformer可以获取到ts类型，可以对ts类型ast进行操作
    afterDeclarations: [],
    after: [], // after中的transformer没有ts类型，只能操作js代码ast
  },
})
```

有了 transformers 接口，就可以编写一个“简单”的 transformer 了，首先是 visitEachChild 函数提供了 ast 修改能力：

```ts
export function visitNodes(node: ts.Node) {
  // 递归，第二个函数参数返回值是ts.Node类型，会替换ast节点
  // 可以按 Array.prototype.map 理解
  return ts.visitEachChild(node, childNode => visitNodes(childNode))
}

ts.transpileModule(`/** typescript代码 **/`, {
  transformers: {
    // transform函数类型 高阶函数
    // transform :: TransformationContext -> ts.Node -> ts.Node
    before: [context => node => visitNodes(node)],
  },
})
```

在 visitNodes 递归函数中，可以判断节点类型和返回新节点替换，下面可以实现一个“小需求”：

需求：利用编译器实现一个注解功能，函数添加一个 jsDoc 注释 `@noexcept`，可以在静态编译的时候自动添加 try catch，就像这样：

```ts
/**
 * @noexcept
 */
function main (): number {
  throw new Error()
}

main() // 不会异常，会将错误log出来
```

首先需要判断节点是函数声明节点：

```ts
// isFunctionDeclaration可以判断当前节点是函数声明
if (ts.isFunctionDeclaration(node)) {
  console.log(node.getText()) // 打印出函数定义完整内容，包括jsDoc注释
}
```

然后获取 jsDoc 的内容，判断是否有`@noexcept`：

```ts
if (ts.isFunctionDeclaration(node)) {
  // getJSDocTags函数获取到jsDoc上的tags
  const enableNoexcept = !!ts.getJSDocTags(node).find(tag => {
    // 判断jsDoc注释中是否有 @noexcept 注释
    return tag.tagName.escapedText === 'noexcept'
  })
}
```

判断函数使用了 `@noexcept` 注释，下面就可以对 ast 节点做修改了（用新节点替换）。

需要将函数体包裹一个 trycatch，首先获取函数体：

```ts
if (ts.isFunctionDeclaration(node)) {
  // 函数节点的属性
  node.decorators // 函数装饰器
  node.modifiers // 不知道是啥
  node.asteriskToken // 不知道是啥
  node.name // 函数名
  node.typeParameters // 函数类型参数
  node.parameters // 函数参数
  node.type // 函数类型
  node.body // 函数体 这个就是我们需要的

  // 示例：可以创建一个一摸一样的函数声明节点clone：
  return ts.factory.createFunctionDeclaration(
    node.decorators,
    node.modifiers,
    node.asteriskToken,
    node.name,
    node.typeParameters,
    node.parameters,
    node.type,
    node.body // 这里修改一下就好了，加上try catch语句包裹
  )
}
```

下面是重点，以 node.body 作为 try 块内容，创建一个 trycatch 语句

```ts
// 创建一个try catch语句
const tryStatement = ts.factory.createTryStatement(
  node.body, // try块内容。node.body是需要包裹的函数体内容，下面创建catch语句部分
  // 创建一个catch
  ts.factory.createCatchClause(
    'error', // catch参数名
    // catch块内容
    ts.factory.createBlock([])
  ),
  undefined // finally就不创建了，只需要处理catch
)
/**
 * 上面的代码做的事情就是下面这样
 * try {
 *  函数体
 * } catch (error) {
 *  错误处理
 * }
 */
```

但是 catch 语句通常是需要处理异常的，不然容易乱吞错误隐藏问题，这里可以给 catch 中添加一条 console.log 调用语句:

```ts
// 创建一个表达式语句
const consoleErrorStatement = ts.factory.createExpressionStatement(
  // 创建一个函数调用表达式
  ts.factory.createCallExpression(
    // 创建调用语句，即console.log(error)
    ts.factory.createIdentifier('console.log'), // 创建一个标识符（函数调用）
    [], // 类型参数，无
    [ts.factory.createIdentifier('error')] // 传入参数
  )
)
```

有了 try catch 语句和 consoleError 语句，下面就可以组合起来，完整代码：

```ts
// 这就是一个简单的transform函数了
export const transformNoExcept = node => {
  if (ts.isFunctionDeclaration(node)) {
    const enable = !!ts.getJSDocTags(node).find(tag => {
      return tag.tagName.escapedText === 'noexcept'
    })
    if (enable) {
      return ts.factory.createFunctionDeclaration(
        node.decorators,
        node.modifiers,
        node.asteriskToken,
        node.name,
        node.typeParameters,
        node.parameters,
        node.type,
        ts.factory.createBlock([
          ts.factory.createTryStatement(
            node.body,
            ts.factory.createCatchClause(
              'error',
              ts.factory.createBlock([
                ts.factory.createExpressionStatement(
                  ts.factory.createCallExpression(
                    ts.factory.createIdentifier('console.log'),
                    [],
                    [ts.factory.createIdentifier('error')]
                  )
                ),
              ])
            ),
            undefined
          ),
        ])
      )
    }
  }
  return node
}
```

给到 transpile 使用：

```ts
export function visitNodes(node: ts.Node) {
  // 处理@noexcept注释，添加tryccatch
  const newNode = transformNoExcept(node)
  if (node !== newNode) {
    return newNode
  }
  return ts.visitEachChild(node, childNode => visitNodes(childNode))
}

ts.transpileModule(`/** typescript代码 **/`, {
  transformers: {
    before: [context => node => visitNodes(node)],
  },
})
```

#### ts-loader 使用 transform 函数

上面已经了解了如何编写一个 transform 函数，但是如何落地到实际项目呢？暴露 transform 接口的是 ts compiler API，而 tsc 和 tsconfig 并没有给出接口。ts-loader 将 transform 接口暴露出来了：

```ts
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          // getCustomTransformers的返回值就是transformers
          getCustomTransformers: () => ({
            // 这里可以设置自己的 transform函数
            before: [context => node => node],
          }),
        },
      },
    ],
  },
}
```

### 总结

1. 使用 ts-compiler 可以更准确地分析代码，例如提取 imports 等。如果自己写正则表达式来匹配代码，容易漏掉 case，而且语法会随语言标准变化。

2. 可以给 ts-compiler 编写 transform 插件函数，实现自定义语法糖。

---

以上代码开源在 github 上：

[Saber2pr/ts-compiler](https://github.com/Saber2pr/ts-compiler)
