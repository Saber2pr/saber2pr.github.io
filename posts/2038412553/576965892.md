Within the react component, you often need to get the data asynchronously and then render, so the following code is written:
```tsx
const Uv = () => {
  const [site_uv, setState] = useState(0)

  useEffect(() => {
    fetchUV().then(({ site_uv }) => setState(site_uv))
  }, [])

  return <div>uv:{site_uv}</div>
}
```
The above process can be encapsulated as a custom hook, for example:
```ts
const useAsync = <T>(p: () => Promise<T>, initState?: T) => {
  const [state, setState] = useState(initState)

  useEffect(() => {
    p().then(setState)
  }, [])

  return state
}
```
Then use within the assembly:
```tsx
export const Uv = () => {
  const { site_uv } = useAsync(fetchUV, { site_uv: 0 })
  return <div>uv:{site_uv}</div>
}
```
It's a lot simpler.