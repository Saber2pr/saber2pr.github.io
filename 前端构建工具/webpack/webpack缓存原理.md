### 目标

1. webpack 插件机制下缓存是如何实现的？
2. 如何冷启动加速，提升 webpack 启动速度？

### 期望收获结果

1. 理解 webpack 缓存原理
2. 总结一个提升 webpack 启动速度提升的方案

### 分析过程

#### 认识 webpack dev 缓存

[配置项 cache](https://webpack.js.org/configuration/other-options/#cache)

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

  // 配置config中字段的默认值
  applyWebpackOptionsDefaults(options)
  // 调用environment插件（内置插件）
  compiler.hooks.environment.call()
  // 调用afterEnvironment插件（内置插件）
  compiler.hooks.afterEnvironment.call()
  // 根据config中启用的配置项，注册对应的内置插件
  new WebpackOptionsApply().process(options, compiler)
  compiler.hooks.initialize.call()
  return compiler
}
```

createCompiler 方法里比较重要且核心的就是 WebpackOptionsApply 这个方法，WebpackOptionsApply 方法中给 compiler 注册了很多内置插件。

webpack 插件逻辑图：

![loading](https://saber2pr.top/MyWeb/resource/image/webpack.svg)

下面是节选了关于 cache 的部分：

```ts
// lib/WebpackOptionsApply.js 简化代码

class WebpackOptionsApply extends OptionsApply {
  constructor() {
    super()
  }
  process(options, compiler) {
    // cache配置项的处理
    // cache相关内置插件
    // 1. MemoryCachePlugin 内存缓存
    // 2. MemoryWithGcCachePlugin 带GC的内存缓存
    // 3. AddBuildDependenciesPlugin 监听配置项，变化时重新启动
    // 4. IdleFileCachePlugin 判断编译线程空闲
    // 5. PackFileCacheStrategy 文件缓存
    if (options.cache && typeof options.cache === 'object') {
      const cacheOptions = options.cache
      // cachedev环境会设置为memory
      switch (cacheOptions.type) {
        // 内存缓存
        case 'memory': {
          // cache.maxGenerations: 1: 在一次编译中未使用的缓存被删除
          // 引用计数，使用一次减1
          // 值为finite时表示永远被引用，不清除
          if (isFinite(cacheOptions.maxGenerations)) {
            // 带GC处理的内存缓存
            new MemoryWithGcCachePlugin({
              maxGenerations: cacheOptions.maxGenerations,
            }).apply(compiler)
          } else {
            new MemoryCachePlugin().apply(compiler)
          }
          break
        }
        // 文件缓存
        case 'filesystem': {
          // cache依赖，当依赖或者webpack.config.js变化时，cache将重置
          // 设置 config: [__filename]表示当webpack.config.js变化时，cache重新生成
          // 例如安装了新的loader
          for (const key in cacheOptions.buildDependencies) {
            const list = cacheOptions.buildDependencies[key]
            new AddBuildDependenciesPlugin(list).apply(compiler)
          }
          // 文件缓存结合内存缓存
          // maxMemoryGenerations和maxGenerations一样，表示几次编译没有引用将会删除
          // 当内存缓存被删除时，再次引用将从磁盘序列化读取
          if (!isFinite(cacheOptions.maxMemoryGenerations)) {
            // 不是finite，即有限生命的缓存
            new MemoryCachePlugin().apply(compiler)
          } else if (cacheOptions.maxMemoryGenerations !== 0) {
            // 是finite，即无限生命的缓存，需要配合gc算法管理内存使用
            new MemoryWithGcCachePlugin({
              maxGenerations: cacheOptions.maxMemoryGenerations,
            }).apply(compiler)
          }

          // 文件缓存
          // 决定什么时候将数据写入文件缓存
          switch (cacheOptions.store) {
            // 编译器线程空闲时
            case 'pack': {
              new IdleFileCachePlugin(
                new PackFileCacheStrategy({
                  compiler,
                  fs: compiler.intermediateFileSystem,
                  context: options.context,
                  // 文件缓存的位置，默认在 node_modules/.cache/webpack
                  cacheLocation: cacheOptions.cacheLocation,
                  // 缓存的版本
                  version: cacheOptions.version,
                  logger: compiler.getInfrastructureLogger(
                    'webpack.cache.PackFileCacheStrategy'
                  ),
                  // 每次编译的快照怎么缓存
                  snapshot: options.snapshot,
                  // 编译缓存过期时间
                  maxAge: cacheOptions.maxAge,
                  // 调试模式
                  profile: cacheOptions.profile,
                  // cache反序列的时候会预先开辟几个buffer区，这里可以把反序列化后未使用的buffer进行concat合并
                  allowCollectingMemory: cacheOptions.allowCollectingMemory,
                }),
                // timeout时间内等待线程空闲再执行文件缓存序列化，如果等待时间超过timeout将强制执行
                // 类似requestIdleCallback timeout
                cacheOptions.idleTimeout,
                // 初始化.cache文件的等待超时时间
                cacheOptions.idleTimeoutForInitialStore
              ).apply(compiler)
              break
            }
            default:
              throw new Error('Unhandled value for cache.store')
          }
          break
        }
        default:
          throw new Error(`Unknown cache type ${cacheOptions.type}`)
      }
    }
    // 用来做一些cache操作过程中的快照统计、各种参数追踪
    new ResolverCachePlugin().apply(compiler)
  }
}
```

MemoryWithGcCachePlugin 插件源码分析：

```ts
class MemoryWithGcCachePlugin {
  constructor({ maxGenerations }) {
    this._maxGenerations = maxGenerations
  }
  apply(compiler) {
    const maxGenerations = this._maxGenerations
    // 双缓存读写分离
    const cache = new Map() // 写入操作
    const oldCache = new Map() // 从cache同步数据，负责读取、计算等操作
    // generation就是编译次数
    let generation = 0
    let cachePosition = 0
    // 计算until
    compiler.hooks.afterDone.tap('MemoryWithGcCachePlugin', () => {
      generation++
      // 第一次oldCache为空
      for (const [identifier, entry] of oldCache) {
        if (entry.until > generation) break
        // util小于generation的cache会被删除
        oldCache.delete(identifier)
        if (cache.get(identifier) === undefined) {
          cache.delete(identifier)
        }
      }

      let i = (cache.size / maxGenerations) | 0 // 取整，将cache等分
      let j = cachePosition >= cache.size ? 0 : cachePosition
      cachePosition = j + i
      // 把cache中的复制到oldCache，同时计算until
      for (const [identifier, entry] of cache) {
        if (j !== 0) {
          j--
          continue
        }
        if (entry !== undefined) {
          cache.set(identifier, undefined)
          oldCache.delete(identifier)
          oldCache.set(identifier, {
            entry,
            // until计算 maxGenerations是额外的generation次数，给cache续命
            until: generation + maxGenerations,
          })
          if (i-- === 0) break
        }
      }
    })
    // 写入cache
    compiler.cache.hooks.store.tap(
      { name: 'MemoryWithGcCachePlugin', stage: Cache.STAGE_MEMORY },
      (identifier, etag, data) => {
        cache.set(identifier, { etag, data })
      }
    )
    // 根据etag获取cache
    compiler.cache.hooks.get.tap(
      { name: 'MemoryWithGcCachePlugin', stage: Cache.STAGE_MEMORY },
      (identifier, etag, gotHandlers) => {
        // 优先读取cache
        const cacheEntry = cache.get(identifier)
        if (cacheEntry === null) {
          return null
        } else if (cacheEntry !== undefined) {
          return cacheEntry.etag === etag ? cacheEntry.data : null
        }
        // 读取oldCache
        // 原因是可能外部在gotHandlers中传入了result null，导致cache中对应缓存为null
        const oldCacheEntry = oldCache.get(identifier)
        if (oldCacheEntry !== undefined) {
          const cacheEntry = oldCacheEntry.entry
          if (cacheEntry === null) {
            oldCache.delete(identifier)
            cache.set(identifier, cacheEntry)
            return null
          } else {
            if (cacheEntry.etag !== etag) return null
            oldCache.delete(identifier)
            cache.set(identifier, cacheEntry)
            return cacheEntry.data
          }
        }
        gotHandlers.push((result, callback) => {
          if (result === undefined) {
            // cache清除对应缓存，会从oldCache中找
            cache.set(identifier, null)
          } else {
            cache.set(identifier, { etag, data: result })
          }
          return callback()
        })
      }
    )
    // 编译任务停止，释放内存
    compiler.cache.hooks.shutdown.tap(
      { name: 'MemoryWithGcCachePlugin', stage: Cache.STAGE_MEMORY },
      () => {
        cache.clear()
        oldCache.clear()
      }
    )
  }
}
```

#### 缓存方案总结

通过 cache 配置底层处理的过程可以了解到，webpack 编译缓存有三种方案：

一、编译生成的依赖树 ast、每个文件处理后的结果等信息缓存到内存中

1. 优点：响应快，每次编译任务启动都直接从内存读取上次生成的 ast 等信息
2. 缺点：关掉 webpack 主线程后，ast 等信息将被释放销毁，下次冷启动要从头开始编译。

二、缓存到 cache 文件中

1. 优点：ast 等信息保存到文件中，冷启动直接从 cache 文件反序列生成 ast，减少初次编译时间。
2. 缺点：热更新响应慢，每次编译任务都要从 cache 文件读取和写入信息，IO 操作频繁。

三、部分文件编译的结果缓存到 cache，部分缓存到内存中

可以合理调配 maxMemoryGenerations 参数，结合内存缓存和文件缓存优点，以及自己机器的硬件性能，将 webpack 编译速度调整到最优。

### webpack 启动/编译 速度调优方案

检查项目规模大小，检查自己机器内存大小

1. 如果是小型项目，追求代码变更立刻编译出结果即响应快，可以选择内存缓存，也就是默认配置。

2. 如果是大型项目，需要长期打开关闭的，冷启动 webpack 特别慢的，可以选择文件缓存。
   如果机器硬件配置不太好内存小的，开发时 webpack 编译导致电脑很卡的，更应该选择文件缓存。

3. 如果项目比较大，又对 webpack 编译速度特别在意，但是内存大小比较一般的，可以在文件缓存模式下，合理配置 maxMemoryGenerations 参数来改善编译速度。
