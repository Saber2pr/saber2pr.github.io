PWA is called Progressive Web App. A technology that can add web pages to the desktop and can be accessed offline, just like local App.
To turn a React single-page application into PWA, you only need to add two files to the original project. Manifest configuration files and service worker scripts.
Here are the brief steps to turn the project into a PWA application.
### Manifest.json
This file is used to describe app information, such as the icon icon, the name application name, and the start_url starting path.
For example:
Manifest.json
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
Then add meta information to the index.html:
```html
<link rel="manifest" href="./manifest.json" />
```
> manifest.json and service-worker.js are best placed in the root directory.
You can see the app message in the chrome console > Application > Manifest.
### Service worker
Used to intercept http requests, use and create caches.
Common lifecycle events in service worker are install, fetch, and active.
1. Installation events are triggered on initialization
> inly adding caches for static resources
Service-worker.js
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
Like other worker, you cannot access DOM. There is no window object, use self instead, these events are also unique to service worker.
The event object has a waitUntil method that waits for promise to complete. Of course, you can also use async (there seems to be a hole).
Caches is a global object, and the open method requires a key to open a cache entry.
The cache.addAll method passes in an array of strings, adding caches in batches.
two。 Intercept request
> ding caches for dynamic resources
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
Note that cache operations consume streams, so clone is required.
> there seems to be an error when using async, but it's worth a try.
After writing, introduce the following in index.ts:
```ts
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    PWAInstaller()
  }
})
```
You can register for service worker.
> because worker is a thread resource and takes a long time, it is better in load events.
You can view the current worker status in the chrome console > Application > Service Workers.
You can see the cache in Application > Cache > Cache Storage.
Debugging method: in the chrome console > Network, change Online to Offline, and then refresh the page to see if there is a response.
### Resource update
1. Update resources in the active event
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
two。 Use the version number to determine whether the service worker needs to be updated, for example:
> the version here is best obtained from the server side, and do not add its cache.
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
### Pit in Service Worker
Cross-domain between https and http is allowed in the main thread of JS, but not in service worker. Event.request.url with http protocol needs to be filtered.