/*
 * @Author: saber2pr
 * @Date: 2019-11-21 22:13:28
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-11-22 11:44:48
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

self.addEventListener("install", async () => {
  const cache = await caches.open(cacheKey)
  cache.addAll(staticAssets)
})

self.addEventListener("fetch", event => {
  const req = event.request
  const url = new URL(req.url)

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req))
  } else if (req.url.indexOf("http") !== -1) {
    event.respondWith(networkFirst(req))
  }
})

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req)
  return cachedResponse || fetch(req)
}

async function networkFirst(req) {
  const cache = await caches.open(cacheKey)

  try {
    const res = await fetch(req)
    cache.put(req, res.clone())
    return res
  } catch (error) {
    return await cache.match(req)
  }
}
