类似 class 组件的 getDerivedStateFromProps

```ts
import { useState, useMemo, useRef } from 'react'

export function useDerivedStateFromProps<T>(s: T): [T, (s: T) => void] {
  const stateRef = useRef<T>(s)
  const [_, forceUpdate] = useState({})

  useMemo(() => {
    stateRef.current = s
  }, [s])

  const setState = (s: T) => {
    stateRef.current = s
    forceUpdate({})
  }

  return [stateRef.current, setState]
}
```

解决什么问题？

props 作为 state，当 props 变化时更新 state

为什么不用 useEffect 监听 props 然后 setState？

父组件更新时，子组件会 render 两次，父组件 render children 一次， effect 中 setState 一次，使用 ref 可以去掉额外的 setState。
