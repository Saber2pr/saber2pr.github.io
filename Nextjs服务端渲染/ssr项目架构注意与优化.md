既然选择 next，当然是为了能够服务端渲染，能够 seo，但是 ssr 的缺点也需要注意。

ssr 需要在服务端进行接口请求，然后使用请求到的数据渲染出 html。这里会产生一个问题，就是如果服务端请求的接口太多，会增加服务器压力，也会让前端页面访问速度变慢。
最合理的 ssr 方案是，需要 seo 的部分接口 ssr，剩下的接口在客户端请求，这样既满足 seo 需求，又可以提高访问速度。

不过这样会增加前端代码复杂度，例如，页面异步渲染的数据一开始是 null，需要组件设置空数据占位和 Loading 动画。

还有一点需要注意，ssr 的数据是不需要登陆的！！ssr 的数据是不需要登陆的！！ssr 的数据是不需要登陆的！！重要的事情说三次。

为什么这一点这么重要，因为当前主流的方案是，token 放在 localstorage 中而不是 cookie，所以服务端渲染时是拿不到 token 的（其实封装一下使用 cookie 可以拿到但没必要），转变思路思考一下，服务端渲染的内容是给搜索引擎看的，而搜索引擎不可能会登录！所以服务端渲染的接口必然是完全开放的！在客户端通过 js 携带 token 访问来异步初始化的内容是权益相关内容，不需要 seo！

使用 next 的核心思想是，csr 为主，ssr 为辅！重 csr，轻 ssr！

### next 项目设计思路

1. 登录后 token 存入 localstorage。
2. 封装一个接口请求函数，自动携带 token。
3. 代理服务端 catch 错误，客户端 response 拦截器 rethrow。
4. 服务端请求需要 seo 的接口。客户端请求不需要 seo 的初始化数据接口。
5. 每个组件模块提供当数据为空时的占位显示，并同时提供 loading 动画。（这一点 antd 做得很好）

> 这里最关键的是第 4 点，这一点没有做好会浪费很多服务器资源会让网站变得特别慢！

### 示例代码(伪代码)

1. 未优化的代码

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

2. 优化后的代码

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

3. 结合组件 loading 设计优化后的代码：

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
