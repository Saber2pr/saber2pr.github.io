Since next is chosen, of course, it is to be able to render and seo on the server side, but the shortcomings of ssr also need to be noted.
Ssr needs to make an interface request on the server, and then render the html using the requested data. There is a problem here, that is, if the server requests too many interfaces, it will increase the pressure on the server and slow down the front-end page access.
The most reasonable ssr scheme is that part of the interface ssr of seo is required, and the rest of the interface is requested on the client side, which not only meets the seo requirements, but also improves the access speed.
However, this will increase the complexity of the front-end code. For example, the data rendered asynchronously on the page starts with null, which requires components to set empty data placeholders and Loading animations.
It is also important to note that ssr data does not need to be logged in! Ssr data does not need to be logged in! Ssr data does not need to be logged in! Say important things three times.
Why is this so important? because the current mainstream solution is to put token in localstorage instead of cookie, so the server can't get token when rendering (in fact, you can get it using cookie, but not necessary). Change your mind. The content rendered on the server is for search engines, but search engines can't log in! So the interface of server rendering must be completely open! The content initialized asynchronously by js with token access on the client side is rights-related content, and does not require seo!
The core idea of using next is that csr is dominant and ssr is secondary! Heavy csr, light ssr!
### Design idea of next Project
1. After logging in, token is stored in localstorage.
2. Encapsulates an interface request function that automatically carries a token.
3. Proxy server catch error, client response interceptor rethrow.
4. The server requests interfaces that require seo. The client requests an initialization data interface that does not require seo.
5. Each component module provides a placeholder display when the data is empty and provides loading animation at the same time. (antd does this very well.)
> the most important thing here is point 4. If this is not done well, it will waste a lot of server resources and make the website very slow!
### Sample code (pseudo code)
1. Unoptimized code
```tsx
export const getServerSideProps = async ctx => {
  const cookie = ctx.headers.cookie
  const seoDataFullPublic = await fetch('/api/xxx')
  const seoDataPublic = await fetch('/api/yyy', {
    headers: { cookie },
  })
  const data = await fetch('/api/zzz', {
    headers: { cookie },
  })
  return {
    props: {
      seoDataFullPublic,
      seoDataPublic,
      data,
    },
  }
}

export default ({ seoDataFullPublic, seoDataPublic, data }) => {
  return (
    <>
      {seoDataFullPublic}
      {seoDataPublic}
      {data}
    </>
  )
}
```
two。 Optimized code
```tsx
export const getServerSideProps = async ctx => {
  const seoDataFullPublic = await fetch('/api/xxx')
  const seoDataPublic = await fetch('/api/yyy')
  return {
    props: {
      seoDataFullPublic,
      seoDataPublic,
    },
  }
}

export default ({ seoDataFullPublic, seoDataPublic }) => {
  const [seoData, setSeoData] = useState(seoDataPublic)
  const [data, setData] = useState()

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/yyy', {
      headers: { Authorization: token },
    }).then(setSeoData)
    fetch('/api/zzz', {
      headers: { Authorization: token },
    }).then(setData)
  }, [])

  return (
    <>
      {seoDataFullPublic}
      {seoData}
      {data}
    </>
  )
}
```
3. Design the optimized code with the component loading:
```tsx
export const getServerSideProps = async () => {
  const seoDataFullPublic = await fetch('/api/xxx')
  const seoDataPublic = await fetch('/api/yyy')
  return {
    props: {
      seoDataFullPublic,
      seoDataPublic,
    },
  }
}

export default ({ seoDataFullPublic, seoDataPublic }) => {
  // 1. seoPublic: init不完全，所以autoLoad一次
  const [result1, loading1, refresh1] = useFetch(
    () => fetch('/api/yyy'),
    seoDataPublic
  )
  // 2. seoFullPublic: init完全，所以不需要autoLoad
  const [result2, loading2, refresh2] = useFetch(
    () => fetch('/api/xxx'),
    seoDataFullPublic,
    false
  )
  // 3. no seo: 不需要init，需要autoLoad一次
  const [result3, loading3, refresh3] = useFetch(() => fetch('/api/zzz'))

  // 控制组件与展示组件示例：
  return (
    <>
      <Input onChange={refresh} />
      <View loading={loading} data={result} />
    </>
  )
}

// 展示组件示例：
export const View = ({ loading, data }) => {
  let content = <>暂无数据</>
  if (data) {
    content = <>{data}</>
  }
  return (
    <div className="my-view">
      <Spin spinning={loading}>{content}</Spin>
    </div>
  )
}
```
[useFetch](/blog/Nextjs服务端渲染/封装接口请求函数)