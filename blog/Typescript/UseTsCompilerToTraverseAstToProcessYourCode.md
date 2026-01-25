### Preface
The purpose of this paper is to give a preliminary guide to the front-end students who know ts compiler for the first time. Through a series of examples from shallow to deep, they can master the basic use of ts compiler, including ast traversal, transform function writing, expression node creation and so on. At the same time, make a brief analysis of ts-loader and ts-node principles. This paper focuses on the compilation of transform function.
### 1. Get to know createProgram and transpileModule of ts compiler
These two functions can be said to be the two main api of ts compiler, and both of them can convert Typescript code into JavaScript.
#### TranspileModule
The difference is that transpileModule only processes text and doesn't do type checking, and that's how it works:
```ts
import ts from 'typescript'

// 直接生成对应js代码。即便ts类型有错误，它仍然能够生成代码。
const js = ts.transpileModule('/** 你的typescript代码 **/').outputText
```
> the experienced front-end students here have guessed the underlying principle of transpileOnly. You may have thought about global @ ts-ignore before.
Here we can give a minimal implementation of ts-loader (not guaranteed to work):
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
#### CreateProgram
So how does createProgram work? CreateProgram scans the typescript file for statements such as import, traverses each ts file for compilation, does type checking, throws a type exception, and terminates the compilation process. It is much more complex to use than transpileModule:
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
This is actually what tsc commands the bottom to do. Here you will find that ts compiler divides into a compilerHost, and this compilerHost is packaged with file writing, reading, and other operations. Of course, you can hijack and modify the host to intercept the output of the file:
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
CompilerHost implements the separation of compiler from the environment, compiler itself is only an implementation of a compiler, file writing and other operations can be used as a host interface.
#### Use typescript compiler on the browser side
With this environment separation foundation, it is possible to run ts compiler on the browser side! Because ts compiler itself is compiled as js, you only need to provide a browser-side compilerHost. Typescript officially provides a virtual file service package @ typescript/vfs to provide browser-side compatible fs services:
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
#### Ts-node principle
Front-end students who often use typescript to develop must have used ts-node to execute ts files. Have you ever thought about its underlying principle?
With the above ts compilation code base, ts-node should do something like:
```txt
读取 ts 文件，使用 transpileModule 函数转成 js，然后执行 eval
```
1. But the eval function is not secure, it can modify anything in the global context, and the vm module provides a more secure runInThisContext function in nodejs to control the scope of access.
2. TranspileModule will not process the import statement to load the module. Ts-node borrows the module loading mechanism of nodejs and rewrites the require function loading:
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
### two。 Know the ast visitor and transformer of ts compiler
Visitor is used to traverse the ast tree, and transformer is used to transform the ast tree. In the ts compiler api, there is a distinction between forEachChild and visitEachChild, similar to the difference between forEach and map.
#### Use visitor to traverse ast
The ast node type in ts compiler is ts.Node. To traverse the ast of a piece of ts code, first create a sourceFile:
```ts
// 创建ast根结点
const rootNode = ts.createSourceFile(
  `input.ts`,
  `/** typescript代码 **/`,
  ts.ScriptTarget.ES2015,
  /*setParentNodes */ true
)
```
ts provides the forEachChild function to traverse the children of the ast node:
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
ForEachChild only traverses down one layer, and here you need to traverse the entire ast tree, so you need to do recursive traversal:
```ts
const traverse = (node: ts.Node) => {
  console.log(node.getText())
  // 递归遍历每个节点
  ts.forEachChild(node, node => traverse(node))
}
```
With the above visitor foundation, you can implement the import statement to analyze the code:
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
This implements the import acquisition of a single file, and if you need to get the import of all the code under the file, you can use the @ nodelib/fs.walk library to get all the files.
#### Use transformer to transform ast
When the ts compiler compiles, it provides a transform interface to modify ast, createProgram and transpileModule. The transform interface is as follows:
```ts
// createProgram
const program = ts.createProgram(['input.ts'], options, compilerHost)
// 最后一个参数是 CustomTransformers
program.emit(undefined, undefined, undefined, undefined, transformers)

// transpileModule
// 第二个参数有transformers接口
ts.transpileModule(`/** typescript代码 **/`, { transformers })
```
Transformers is an object that provides three lifecycle hooks, which are pre-compile, compile-time, and post-compile:
```ts
ts.transpileModule(`/** typescript代码 **/`, {
  transformers: {
    before: [], // before中的transformer可以获取到ts类型，可以对ts类型ast进行操作
    afterDeclarations: [],
    after: [], // after中的transformer没有ts类型，只能操作js代码ast
  },
})
```
With the transformers interface, you can write a "simple" transformer. First, the visitEachChild function provides the ability to modify ast:
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
In the visitNodes recursive function, you can determine the node type and return a new node replacement. Here is a "small requirement":
Requirements: use the compiler to implement an annotation function, add a jsDoc annotation `@ nobuttt` to the function, and add try catch automatically during static compilation, like this:
```ts
/**
 * @noexcept
 */
function main (): number {
  throw new Error()
}

main() // 不会异常，会将错误log出来
```
First, you need to determine that the node is a function declaration node:
```ts
// isFunctionDeclaration可以判断当前节点是函数声明
if (ts.isFunctionDeclaration(node)) {
  console.log(node.getText()) // 打印出函数定义完整内容，包括jsDoc注释
}
```
Then get the content of jsDoc to determine whether there is `@ nosprint`:
```ts
if (ts.isFunctionDeclaration(node)) {
  // getJSDocTags函数获取到jsDoc上的tags
  const enableNoexcept = !!ts.getJSDocTags(node).find(tag => {
    // 判断jsDoc注释中是否有 @noexcept 注释
    return tag.tagName.escapedText === 'noexcept'
  })
}
```
Determine that the function uses the `@ nosprint` annotation, so you can modify the ast node (replace it with the new node).
You need to wrap the function body in a trycatch, first get the function body:
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
Here is the point: create a trycatch statement with node.body as the content of the try block
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
However, catch statements usually need to handle exceptions, otherwise it is easy to swallow errors to hide the problem. Here, you can add a console.log call statement to catch:
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
With the try catch statement and the consoleError statement, the following can be combined to complete the code:
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
For transpile to use:
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
#### Ts-loader uses the transform function
I've seen how to write a transform function, but how do I translate it to an actual project? The ts compiler API exposes the transform interface, while tsc and tsconfig do not. ts-loader exposes the transform interface:
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
### Summary
1. Using ts-compiler, you can analyze the code more accurately, such as extracting imports, and so on. If you write your own regular expressions to match the code, it is easy to miss case, and the syntax will change according to language standards.
two。 You can write transform plug-in functions for ts-compiler to implement custom syntax sugar.
---
The above code is open source on github:
[Saber2pr/ts-compiler](https://github.com/Saber2pr/ts-compiler)