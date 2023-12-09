在 react 组件内，经常需要异步获取数据，然后渲染，所以会写出以下代码：

```tsx
const Uv = () => {
  const [site_uv, setState] = useState(0)

  useEffect(() => {
    fetchUV().then(({ site_uv }) => setState(site_uv))
  }, [])

  return <div>uv:{site_uv}</div>
}
```

以上过程完全可以封装为一个 custom hook，例如：

```ts
const useAsync = <T>(p: () => Promise<T>, initState?: T) => {
  const [state, setState] = useState(initState)

  useEffect(() => {
    p().then(setState)
  }, [])

  return state
}
```

然后在组件内使用：

```tsx
export const Uv = () => {
  const { site_uv } = useAsync(fetchUV, { site_uv: 0 })
  return <div>uv:{site_uv}</div>
}
```

简洁了很多。
