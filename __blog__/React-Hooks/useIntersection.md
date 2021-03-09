```ts
import { useEffect, useRef } from 'react'

const map = new WeakMap<Element, (target: Element) => void>()

const IO =
  typeof window === 'undefined'
    ? null
    : new IntersectionObserver(entries => {
        entries.forEach(item => {
          if (item.isIntersecting) {
            map.get(item.target)(item.target)
          }
        })
      })

export const useIntersection = (
  callback: (target: Element) => void,
  enable = true
) => {
  const ref = useRef<HTMLElement>()
  useEffect(() => {
    if (!enable) return
    map.set(ref.current, callback)
    IO.observe(ref.current)
    return () => {
      IO.unobserve(ref.current)
      map.delete(ref.current)
    }
  }, [callback, enable])

  return ref
}
```
