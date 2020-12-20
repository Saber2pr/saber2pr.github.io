在 React Hook 中可能多次使用 useState/setState，例如：

```ts
const useValue = () => {
  const [a, setA] = useState(0)
  const [b, setB] = useState(1)

  const update = () => {
    setA(a)
    setB(a)
  }

  return update
}
```

这样使用 useValue 的组件会多次 render。

使用 batchedUpdate 优化：

```ts
import { unstable_batchedUpdates } from 'react-dom'

const useValue = () => {
  const [a, setA] = useState(0)
  const [b, setB] = useState(1)

  const update_batched = () =>
    unstable_batchedUpdates(() => {
      setA(a)
      setB(a)
    })

  return update_batched
}
```
