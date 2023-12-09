请求封装：

```tsx
import axios, { AxiosResponse } from 'axios'

export const toQueryStr = (obj: any) => new URLSearchParams(obj).toString()
export const appendParams = (url: string, params?: object) => {
  if (url && params) {
    if (url.indexOf('?') !== -1) {
      return `${url}&${toQueryStr(params)}`
    } else {
      return `${url}?${toQueryStr(params)}`
    }
  }
  return url
}

export const join = (base: string, path: string) => {
  if (base && path) {
    base = base.replace(/\/$/, '')
    path = path.replace(/^\//, '')
    return `${base}/${path}`
  }
  return base || path
}

export interface RequestProxyOptions {
  baseUrl?: string
  url: string
  params?: object
  method?: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'
  data?: any
}

export const requestProxy = async <T>({
  baseUrl,
  url,
  params,
  method = 'get',
  data,
}: RequestProxyOptions): Promise<AxiosResponse<T>> => {
  const path = baseUrl ? join(baseUrl, url) : url
  return axios({
    method,
    data,
    url: '/api/proxy',
    params: {
      url: params ? appendParams(path, toQueryStr(params)) : path,
    },
  })
}
``` 

next api:

```tsx
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'url'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.query?.url as string
  const method = req.method as any
  const body = req.body
  const headers = (req.headers ?? {}) as any

  headers.host = parse(url).host

  try {
    const apiRes = await axios({
      url,
      data: body,
      method: method,
      headers,
    })

    res.end(JSON.stringify(apiRes.data))
  } catch (error) {
    res.end(JSON.stringify(error))
  }
}
```
