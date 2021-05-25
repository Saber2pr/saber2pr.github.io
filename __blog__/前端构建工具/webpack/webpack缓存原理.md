### 目标

1. webpack 插件机制下缓存是如何实现的？
2. 如何冷启动加速，提升 webpack 启动速度？

### 期望收获结果

1. 理解 webpack 缓存原理
2. 总结一个提升 webpack 启动速度提升的方案

### 分析过程

#### 认识 webpack dev 缓存

> 在 prod 模式 cache 会被禁用，以下讨论都是针对 dev 环境。
> 目的在于探索提升 dev 开发体验的方法。

1. 内存缓存

webpack dev 模式下编译打包的结果默认会保存在内存中，不会输出到静态文件，在 dev-server 中加载的资源也是从内存中加载的通过{publicPath}/{filename}来访问。

> 在 prod 模式下 webpack 会禁用编译缓存，直接输出到文件。

```js
module.exports = {
  cache: true, // dev模式下默认。编译缓存将保存在内存中。
  // cache: { type: 'memory' }, // 和上面等价。
}
```

2. 文件缓存

cache 项 type 可以手动更改为 filesystem，使用文件缓存。每次编译的结果都会序列化保存到 node_modules/.cache 目录下，当下次编译启动时会从 cache 反序列化加载，减少对机器内存的压力：

```js
module.exports = {
  cache: {
    type: 'filesystem', // 编译缓存将保存在文件中，不占用内存
  },
}
```

#### webpack 缓存底层逻辑

webpack 内部使用 tapable 事件机制来插件化逻辑，compiler 中初始化 dispatcher，然后 plugin 中在 apply 方法里注册订阅器，在事件回调中执行插件逻辑。

1. webpack 执行入口

```ts
// lib/webpack.js 简化代码
const webpack = options => {
  let compiler = createCompiler(options)
  return compiler
}

const createCompiler = rawOptions => {
  const options = getNormalizedWebpackOptions(rawOptions)
  // 设置webpack config默认值
  applyWebpackOptionsBaseDefaults(options)
  // 创建一个compiler
  const compiler = new Compiler(options.context)
  compiler.options = options

  // 这里可以看到webpack plugin都是暴露一个apply方法，然后内部去订阅插件事件
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler)
  // 遍历所有插件，插件apply执行订阅
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler)
      } else {
        plugin.apply(compiler)
      }
    }
  }

  // 设置webpack config默认值
  applyWebpackOptionsDefaults(options)
  // 调用environment插件（内置插件）
  compiler.hooks.environment.call()
  // 调用afterEnvironment插件（内置插件）
  compiler.hooks.afterEnvironment.call()
  new WebpackOptionsApply().process(options, compiler)
  compiler.hooks.initialize.call()
  return compiler
}
```

待更新
