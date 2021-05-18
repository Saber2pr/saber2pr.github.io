### 目标

1. webpack插件机制，如何编写一个webpack插件？

2. webpack插件机制下缓存是如何实现的，如何冷启动加速？

### 期望收获结果

1. 学会编写一个webpack插件

2. 总结一个提升webpack启动、构建速度提升的方案

### 分析webpack插件执行过程

webpack内部使用tapable事件机制来插件化逻辑，compiler中初始化dispatcher，然后plugin中在subscribe事件回调里执行逻辑，plugin的调用方dispatch一个事件来执行plugin。

CachePlugin通过apply注册store、get事件到compiler，根据identifier & etag来添加、获取缓存。Cache中发起store、get事件来添加、获取缓存。

1. 入口

webpack -> createCompiler -> WebpackOptionsApply -> options.cache
-> MemoryWithGcCachePlugin | MemoryCachePlugin | IdleFileCachePlugin

2. compiler作为事件代理

---

待更新