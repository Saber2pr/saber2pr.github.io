/*
 * @Author: saber2pr
 * @Date: 2019-11-21 22:13:28
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-01-23 21:02:49
 */
const staticAssets = [
  /** CODE START **/"/build/0.css","/build/2.css","/build/4.css","/build/6.css","/build/index~21833f8f.min.js","/build/index~970f9218.css","/build/index~970f9218.min.js","/build/index~f71cff67.min.js","/build/vendors~index~0928ebd2.min.js","/build/vendors~index~253ae210.min.js","/build/vendors~index~678f84af.min.js","/build/vendors~index~7d359b94.min.js"/** CODE END **/,
  "/",
  // data
  "/static/data/home.json",
  "/static/data/activity.json",
  "/static/data/blog.json",
  "/static/data/learn.json",
  "/static/data/about.json",
  "/static/data/links.json",
  "/static/data/musicList.json",
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
  const url = event.request.url
  if (url.startsWith("http:")) return

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
