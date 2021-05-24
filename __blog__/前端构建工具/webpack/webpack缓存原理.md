### 目标

1. webpack 插件机制，如何编写一个 webpack 插件？

2. webpack 插件机制下缓存是如何实现的，如何冷启动加速？

### 期望收获结果

1. 学会编写一个 webpack 插件

2. 总结一个提升 webpack 启动、构建速度提升的方案

### 分析过程

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
