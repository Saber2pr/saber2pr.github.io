The proxy can cache some interfaces to improve access speed:
```ts
import { AxiosInstance } from 'axios'
import LRU from 'lru-cache'

const ApiUrls = {
  list: '/get/list',
}

const cachelist: Array<keyof typeof ApiUrls> = ['list']

const HOUR_MS = 3600000

const cache = new LRU<string, any>({
  max: 1000,
  maxAge: 1 * HOUR_MS, // 毫秒
})

const matchCache = (api: string) => {
  return !!cachelist.find(key => api.endsWith(ApiUrls[key]))
}

type Req = {
  url?: any
  method?: any
}

export const getCacheSize = () => cache.itemCount

export const getCache = (req: Req) => {
  const url = req.url
  const method = req.method
  if (url && method === 'GET') {
    const api = url.split('?')[0]
    if (api && matchCache(api)) {
      console.log(`[Get-Cache]: ${url}`)
      return cache.get(url)
    }
  }
}

export const setCache = (req: Req, data: any) => {
  const url = req.url
  const method = req.method
  if (url && method === 'GET') {
    const api = url.split('?')[0]
    if (api && matchCache(api)) {
      console.log(`[Set-Cache]: ${url}`)
      cache.set(url, data)
    }
  }
}

export const delCache = (req: Req) => {
  const url = req.url
  const method = req.method
  if (url && method === 'GET') {
    const api = url.split('?')[0]
    if (api && matchCache(api)) {
      console.log(`[Del-Cache]: ${url}`)
      cache.del(url)
    }
  }
}

export const clearCache = () => {
  cache.reset()
}

const toQueryStr = (obj: any) => new URLSearchParams(obj).toString()

export const enhanceAxiosCache = (axios: AxiosInstance) => {
  const originGet = axios.get
  axios.get = async (url, config) => {
    const queryStr = config?.params ? toQueryStr(config.params) : ''
    const cacheKey = { url: `${url}?${queryStr}`, method: 'GET' }
    const result = getCache(cacheKey)
    if (result) {
      return result
    }
    try {
      const apiRes = await originGet(url, config)
      setCache(cacheKey, apiRes)
      return apiRes as any
    } catch (err) {
      delCache(cacheKey)
      throw err
    }
  }
  return axios
}
```
Only GET requests are cached, using method:
```ts
const request = enhanceAxiosCache(axios.create({}))
// 缓存
request.get('/api/list')
```
> Server-side caching will introduce state. It is not recommended to use proxy server-side caching if it is not particularly necessary.