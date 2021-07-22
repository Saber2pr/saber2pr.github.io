/*
 * @Author: saber2pr
 * @Date: 2019-11-21 22:13:28
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-06 18:32:37
 */
const staticAssets = [
  /** CODE START **/"\\build\\index~01e7b97caee842c97f46a58d2dfe.css","\\build\\index~01e7b97caee842c97f46a58d2dfe.min.js","\\build\\style.1aee842c97f46a58d2dfe.css","\\build\\vendor~index~253ae210aee842c97f46a58d2dfe.min.js"/** CODE END **/,
  '/',
  // icon
  '/static/icon/saber2pr-144x144.png',
  // image
  '/static/image/bg-mb.webp',
  '/static/image/bg-pc.webp',
  // style
  '/static/style/dark.css',
]

const StaticCacheKey = 'saber2pr-pwa-static'
const DynamicCacheKey = 'saber2pr-pwa-dynamic'

self.addEventListener('install', event =>
  event.waitUntil(
    caches.open(StaticCacheKey).then(cache => cache.addAll(staticAssets))
  )
)

const filterUrl = url =>
  url.includes('jsonpCallback') ||
  url.includes('static/data/version.json') ||
  url.includes('/api') ||
  url.includes('music.163.com') ||
  url.includes('music.126.net') ||
  url.includes('saber2pr.top/editor') || 
  url.includes('cdn.jsdelivr.net')

self.addEventListener('fetch', event => {
  const url = event.request.url
  // only https
  if (!url.startsWith('https:')) return
  if (filterUrl(url)) return

  if (staticAssets.find(path => path !== '/' && url.includes(path))) {
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

self.addEventListener('activate', event => event.waitUntil(clients.claim()))
