You may use useState/setState multiple times in React Hook, for example:
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
Components that use useValue in this way will render multiple times.
Optimize with batchedUpdate:
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