/*
 * @Author: saber2pr
 * @Date: 2019-11-21 22:13:28
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-01-23 12:10:06
 */
const staticAssets = [
  "/",
  // source code
  "/build/bundle.min.js",
  "/build/style.min.css",
  // data
  "/static/data/about.json",
  "/static/data/activity.json",
  "/static/data/blog.json",
  "/static/data/home.json",
  "/static/data/learn.json",
  "/static/data/links.json",
  // image
  "/static/image/bg-mb.webp",
  "/static/image/bg-pc.webp",
  // style
  "/static/style/dark.css"
]

const cacheKey = "saber2pr-pwa"

self.addEventListener("install", event =>
  event.waitUntil(
    caches
      .open(cacheKey)
      .then(cache => cache.addAll(staticAssets))
      .then(() => self.skipWaiting())
  )
)

const filterUrl = url =>
  url.includes("jsonpCallback") ||
  url.includes("static/data/version.json") ||
  url.includes("/api")

self.addEventListener("fetch", event => {
  if (event.request.url.startsWith("http://")) return false

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
          .open(cacheKey)
          .then(cache => cache.put(event.request, resToCache))

        return resFromNet
      })
    })
  )
})

self.addEventListener("activate", event => event.waitUntil(clients.claim()))
