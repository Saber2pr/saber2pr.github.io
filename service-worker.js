/*
 * @Author: saber2pr
 * @Date: 2019-11-21 22:13:28
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-01-26 14:12:35
 */
const staticAssets = [
  /** CODE START **/"/build/index~f71cff67.css","/build/index~f71cff67.min.js","/build/style.1.css","/build/style.3.css","/build/vendor~index~253ae210.min.js","/build/vendor~index~678f84af.min.js","/build/vendor~index~7d359b94.min.js","/build/vendor~index~f734b0c6.min.js"/** CODE END **/,
  "/",
  // icon
  "/static/icon/saber2pr-144x144.png",
  // image
  "/static/image/bg-mb.webp",
  "/static/image/bg-pc.webp",
  // style
  "/static/style/dark.css"
]

const StaticCacheKey = "saber2pr-pwa-static"
const DynamicCacheKey = "saber2pr-pwa-dynamic"

self.addEventListener("install", event =>
  event.waitUntil(
    caches.open(StaticCacheKey).then(cache => cache.addAll(staticAssets))
  )
)

const filterUrl = url =>
  url.includes("jsonpCallback") ||
  url.includes("static/data/version.json") ||
  url.includes("/api")

self.addEventListener("fetch", event => {
  const url = event.request.url
  if (url.startsWith("http:")) return

  if (staticAssets.find(path => url.includes(path))) {
    event.respondWith(caches.match(event.request))
    return
  }

  event.respondWith(
    caches.match(event.request).then(resFromCache => {
      if (resFromCache) return resFromCache
      const reqToCache = event.request.clone()

      return fetch(reqToCache).then(resFromNet => {
        if (
          filterUrl(reqToCache.url) ||
          (resFromNet && resFromNet.status !== 200)
        ) {
          return resFromNet
        }

        const resToCache = resFromNet.clone()
        caches
          .open(DynamicCacheKey)
          .then(cache => cache.put(event.request, resToCache))

        return resFromNet
      })
    })
  )
})

self.addEventListener("activate", event => event.waitUntil(clients.claim()))
