### Webpack design idea
1. Parse the dependency tree from the entry file
1. Loader converts each file node
2. Plugin listens for compilation events
### webpack intermediate process from entry file to product output
1. Read the webpack config file, merge with the built-in parameters, get the webpack startup initial parameters, and initialize the compiler
two。 Load all plugin plug-ins and register listening events
3. Get the entry entry from the startup parameters and start the compilation
4. Convert the file according to the loaders matched in rules
5. Loaders first executes the pitch method from left to right, and then executes the normal method from right to left to complete the conversion processing of the file node
6. After all files are processed, a file dependency tree is obtained, i.e., the content after file conversion and its dependency nodes, and then the merged processing is packaged and output into a file.
7. When the above process is special, the built-in event will be triggered. Plugin can register to listen through the apply method.
### Loader principle
Loader is a conversion function that inputs the original text and outputs the converted text, such as simply implementing ts-loader
```ts
const ts = require('typescript')

// normal方法
module.exports = (source) => {
  return ts.transpile(source).outputText
}

// pitch方法
module.exports.pitch = (source) => {
  // 这里如果返回了值，就会停止向右pitch，开始向左执行normal
  // return source
}
```
### Plugin Principle
Webpack itself is event-based and contains a number of built-in plug-ins that are executed based on event subscriptions. A simple plug-in is as follows:
```ts
class MyHtmlPlugin {
  constructor(options) {
    // 从参数拿到html模板
    this.templateContent = options.templateContent
  }

  apply(compiler){
    const self = this
    // 监听emit事件
    compiler.hooks.emit.tapAsync('MyHtmlPlugin', (compilation, callback) => {
      // 往assets列表添加一个index.html
      compilation.assets['index.html'] = {
        source() {
          return self.templateContent
        },
        size() {
          // 返回文件字节大小
          return this.source().length
        }
      }
      callback()
    })
  }
}
module.exports = MyHtmlPlugin;
```
Common events:
1. AfterPlugins: start a new compilation
2. Compile: before creating the compilation object
3. Compilation: the compilation object has been created
4. Emit: resource generation is complete, before output
5. AfterEmit: complete the output of resources to the directory
6. Done: complete compilation