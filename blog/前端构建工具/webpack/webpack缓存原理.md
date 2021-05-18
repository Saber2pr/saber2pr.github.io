webpack内部使用tapable事件机制来插件化逻辑，compiler中初始化dispatcher，然后plugin中在subscribe事件回调里执行逻辑，plugin的调用方dispatch一个事件来执行plugin。

CachePlugin通过apply注册store、get事件到compiler，根据identifier & etag来添加、获取缓存。Cache中发起store、get事件来添加、获取缓存。

1. 入口

webpack -> createCompiler -> WebpackOptionsApply -> options.cache
-> MemoryWithGcCachePlugin | MemoryCachePlugin | IdleFileCachePlugin

2. compiler作为事件代理

---

待更新