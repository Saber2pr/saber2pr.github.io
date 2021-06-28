```ts
import { useMemo, useRef, useState } from 'react'

import { useInterval } from './useInterval'

export const useTimer = (s = 0, interval = 1) => {
  const ref = useRef(s)
  const [_, setState] = useState({})

  useMemo(() => {
    ref.current = s
  }, [s])

  useInterval(() => {
    ref.current += interval
    setState({})
  }, 1000 * interval)

  return ref.current
}
```
