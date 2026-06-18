### target
1. How is caching implemented under the webpack plug-in mechanism?
two。 How to accelerate the cold startup to improve the startup speed of webpack?
### Expected harvest results
1. Understand webpack caching principle
two。 Summarize a scheme to improve the startup speed of webpack.
### Analysis process
#### Recognize webpack dev caching
[Configuration item cache](https://webpack.js.org/configuration/other-options/#cache)
> cache is disabled in prod mode. The following discussion is aimed at dev environment.
> the purpose is to explore ways to improve the dev development experience.
1. Memory cache
The results of compilation and packaging in webpack dev mode are saved in memory by default and are not output to static files, and the resources loaded in dev-server are also accessed through {publicPath} / {filename} from memory.
> in prod mode, webpack disables the compilation cache and outputs it directly to a file.
```js
module.exports = {
  cache: true, // dev模式下默认。编译缓存将保存在内存中。
  // cache: { type: 'memory' }, // 和上面等价。
}
```
two。 File caching
The cache item type can be manually changed to filesystem, using file caching. The result of each compilation is serialized and saved to the node_modules/.cache directory, and when the next compilation starts, it will be deserialized from cache, reducing the pressure on machine memory:
```js
module.exports = {
  cache: {
    type: 'filesystem', // 编译缓存将保存在文件中，不占用内存
  },
}
```
#### Webpack cache underlying logic
Webpack internally uses the tapable event mechanism to plug-in logic, initializing dispatcher in compiler, then registering the subscriber in the apply method in plugin, and executing the plug-in logic in the event callback.
1. Webpack execution entry
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
The most important and core of the createCompiler method is the WebpackOptionsApply method, which registers many built-in plug-ins for compiler in the WebpackOptionsApply method.
Webpack plug-in logic diagram:
![loading](https://saber2pr.top/MyWeb/resource/image/webpack.svg)
The following is an excerpt about cache:
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
MemoryWithGcCachePlugin plug-in source code analysis:
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
#### Summary of caching schemes
You can learn from the process of configuring the underlying processing by cache that there are three scenarios for webpack compilation caching:
First, the dependency tree ast generated by compilation and the results of each file after processing are cached in memory.
1. Advantages: fast response, reading the last generated ast and other information directly from memory every time the compilation task starts.
two。 Disadvantages: after shutting down the main thread of webpack, information such as ast will be released and destroyed, and the next cold start will be compiled from scratch.
Second, cache to the cache file
1. Advantages: information such as ast is saved to the file, cold start directly generates ast from cache file reverse sequence, reducing initial compilation time.
two。 Disadvantages: hot update response is slow, each compilation task has to read and write information from the cache file, IO operations are frequent.
3. The compiled results of some files are cached in cache and partly in memory.
The maxMemoryGenerations parameters can be adjusted reasonably, and the webpack compilation speed can be optimized by combining the advantages of memory cache and file cache, as well as the hardware performance of your own machine.
### webpack startup/compilation speed tuning scheme
Check the project size, check the memory size of your machine.
1. If it is a small project, the pursuit of code changes immediately compile the results that is fast response, you can choose memory cache, that is, the default configuration.
two。 If it is a large project, need to open and close for a long time, cold start webpack is particularly slow, you can choose file cache.
If the hardware configuration of the machine is not good and the memory is small, if the computer is very stuck due to webpack compilation during development, you should choose file cache.
3. If the project is relatively large and pay special attention to the webpack compilation speed, but the memory size is relatively general, you can reasonably configure the maxMemoryGenerations parameters in the file cache mode to improve the compilation speed.