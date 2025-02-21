GetDerivedStateFromProps similar to class components
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
Solve what problem?
Props, as state, updates state when props changes
Why not use useEffect to listen to props and then setState?
When the parent component is updated, the child component will render twice, the parent component render children once, and the setState in the effect once. Additional setState can be removed by using ref.