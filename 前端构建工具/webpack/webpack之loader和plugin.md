### webpack设计思想

1. 从入口文件解析依赖树
1. loader转换每个文件节点
2. plugin监听编译事件

### webpack从入口文件到产物输出中间过程

1. 读取webpack config文件，与内置参数合并，得到webpack启动初始参数，并初始化compiler
2. 加载所有plugin插件，注册监听事件
3. 从启动参数得到entry入口，开始执行编译
4. 根据rules中匹配到的loaders，对文件进行转换处理
5. loaders首先从左到右执行pitch方法，然后从右到左执行normal方法，完成文件节点的转换处理
6. 所有文件处理完成后得到一颗文件依赖树即文件转换后的内容和它的依赖节点，然后合并处理打包输出到一个文件中
7. 在以上过程特殊时机会触发内置事件，plugin可以通过apply方法中进行注册监听

### loader原理

loader就是一个转换函数，输入原始文本，输出转换后的文本，例如简单实现ts-loader

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

### plugin原理

webpack本身就是基于事件机制的，包含了很多内置插件，这些插件都是基于事件订阅来执行的。一个简单的插件如下：

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

常用事件：

1. afterPlugins: 启动一次新的编译
2. compile: 创建compilation对象之前
3. compilation:	compilation对象创建完成
4. emit: 资源生成完成，输出之前
5. afterEmit: 资源输出到目录完成
6. done: 完成编译
