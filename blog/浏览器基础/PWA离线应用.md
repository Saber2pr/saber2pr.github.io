PWA 全称 Progressive Web App。可以把网页添加到桌面，并可以离线访问的技术，就像本地 App 一样。

将一个 React 单页应用变成 PWA 只需要在原有项目上添加两个文件就够了。manifest 配置文件和 service worker 脚本。

下面是简要的步骤，可以将项目变成 PWA 应用。

### manifest.json

这个文件用来描述 app 的信息，例如 icon 图标，name 应用名称，start_url 起始路径。

例如：

manifest.json

```js
{
  "name": "saber2prの窝",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/static/icon/saber2pr-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    }
  ]
}
```

然后在 index.html 里添加元信息：

```html
<link rel="manifest" href="./manifest.json" />
```

> manifest.json 和 service-worker.js 最好都放在根目录。

在 chrome 控制台 > Application > Manifest 里就能看到 app 信息了。

### service worker

用于拦截 http 请求，使用和创建缓存。

service worker 常用的生命周期事件有 install、fetch、active。

1. 安装事件在初始化时触发

> 主要添加静态资源的缓存

service-worker.js

```js
const cacheKey = "pwa-test"

self.addEventListener("install", event =>
  event.waitUntil(
    caches
      .open(cacheKey)
      .then(cache =>
        cache.addAll(["/", "/build/bundle.min.js", "/build/style.min.css"])
      )
  )
)
```

和其他 worker 一样，不能访问 DOM。没有 window 对象，使用 self 代替，这几个事件也是 service worker 独有的。

event 对象有一个 waitUntil 方法，就是等待 promise 完成。当然也可以用 async(貌似有坑)。

caches 是一个全局对象，open 方法需要一个 key，打开一个缓存项。

cache.addAll 方法传入的是字符串数组，批量添加缓存。

2. 拦截请求

> 添加动态资源的缓存

```js
// 监听fetch事件
self.addEventListener("fetch", event =>
  // event.respondWith()返回响应，类似nodejs上的res.end()，但接收的是promise。
  event.respondWith(
    // caches.match匹配缓存。
    caches.match(event.request).then(resFromCache => {
      // 缓存命中，返回缓存。跳过http请求。
      if (resFromCache) return resFromCache
      // event.request是`流对象`，只能使用一次，或者使用clone克隆。
      const reqToCache = event.request.clone()

      // 没有缓存，从网络获取资源
      return fetch(reqToCache).then(resFromNet => {
        // 因为这里的response要使用两次，cache.put消耗一次，所以要clone
        const resToCache = resFromNet.clone()
        // 存入缓存
        caches
          .open(cacheKey)
          .then(cache => cache.put(event.request, resToCache))
        return resFromNet // 返回响应
      })
    })
  )
)
```

注意 cache 操作会消耗流，所以需要 clone。

> 使用 async 貌似会出现错误，不过值得去试一下。

写好后，在 index.ts 引入：

```ts
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    PWAInstaller()
  }
})
```

就可以注册 service worker 了。

> 由于 worker 属于线程资源，耗时较长，所以在 load 事件里比较好。

在 chrome 控制台 > Application > Service Workers 可以查看当前 worker 状态。

Application > Cache > Cache Storage 里可以看到缓存。

调试方法：在 chrome 控制台 > Network 里把 Online 改成 Offline，然后刷新页面，看是否有响应。

### 资源更新

1. 在 active 事件里更新资源

```ts
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          // 通过cacheKey来判断缓存资源版本
          if (key !== cacheKey) {
            return caches.delete(key)
          }
        })
      )
    )
  )

  return self.clients.claim() // claim刷新缓存
})
```

2. 利用版本号，判断是否需要更新 service worker，例如：

> 这里的 version 最好从服务器端获取，并且不要添加它的缓存。

```ts
declare const version: string

export const PWAInstaller = async () => {
  // 注册service worker
  const registration = await navigator.serviceWorker.register(
    "/service-worker.js"
  )

  // 如果版本一致，则返回
  if (localStorage.getItem("sw_version") === version) return

  // 如果版本不一致，则清空缓存
  await caches.delete(cacheKey)
  // 更新service worker
  await registration.update()
  localStorage.setItem("sw_version", version)
}

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    PWAInstaller()
  }
})
```

### 在 Service Worker 中的坑

在 JS 主线程中可以允许 https 和 http 之间的跨域，但在 service worker 里不允许，需要过滤协议为 http 的 event.request.url。
