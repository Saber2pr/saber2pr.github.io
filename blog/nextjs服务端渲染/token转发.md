在 login 后把 token 存到 cookie，浏览器每次访问时 nextjs 从 req.headers.cookie 中解析出 token，然后通过 Authorization:Bearer 发给 java 后端。

```ts
import axios, { AxiosError } from 'axios'
import { ParsedUrlQuery } from 'querystring'

import Cookies from 'universal-cookie'

import { getToken } from './getToken'
import { printReqUrl, resolveResponse } from './interceptors'

import type { AxiosInstance } from 'axios'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
type Props = { [key: string]: any }

type AxiosHandler<P extends Props = Props> = (
  request: AxiosInstance,
  ctx: GetServerSidePropsContext<ParsedUrlQuery>
) => P | Promise<P>

export const ApiConfig = {
  log: true,
  target: 'xxx',
}

export const getToken = (cookie: string) => {
  const cookies = new Cookies(cookie)
  return cookies.get('token')
}

/**
 * 注入Axios实例
 * 1. 服务端渲染时转发token
 * 2. HTTP异常处理
 */
export const withAxios = <P>(
  handler: AxiosHandler<P>
): GetServerSideProps => async (ctx) => {
  const cookie = ctx?.req?.headers?.cookie
  const token = getToken(cookie)

  const request = axios.create({
    baseURL: ApiConfig.target,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  request.interceptors.request.use(printReqUrl)
  request.interceptors.response.use(resolveResponse)

  let props = {}
  try {
    // 服务端HTTP Exception统一捕获
    props = await handler(request, ctx)
  } catch (error) {
    const axiosError: AxiosError = error
    const code = axiosError?.response?.status
    const statusText = axiosError?.response?.statusText
    console.log('code', code)

    if (code === 401) {
      ctx.res.writeHead(302, {
        Location: `/login`,
      })
      ctx.res.end()
    }

    props = { code, statusText }
  }

  return { props }
}
```

withAxios 用法：

```tsx
interface Props {
  data: any
}

export const getServerSideProps = withAxios<Props>(
  async ({ get, post }, ctx) => {
    const query = ctx.query
    console.log('query', query)
    const apiRes = await get('/api/xxx')
    return {
      data: apiRes.data,
    }
  }
)

export default (props: Props) => {
  // 避免服务端console
  useEffect(() => {
    console.log('data', props)
  }, [])
  return <MainLayout></MainLayout>
}
```
