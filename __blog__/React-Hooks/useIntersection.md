```ts
import { useEffect, useRef } from 'react'

const map = new WeakMap<Element, (target: Element) => void>()

let IO: IntersectionObserver = null
if (
  typeof window !== 'undefined' &&
  typeof IntersectionObserver !== 'undefined'
) {
  IO = new IntersectionObserver(entries => {
    entries.forEach(item => {
      if (item.isIntersecting) {
        map.get(item.target)(item.target)
      }
    })
  })
}

export const useIntersection = (
  callback: (target: Element) => void,
  enable = true
) => {
  const ref = useRef<HTMLElement>()
  useEffect(() => {
    if (!enable) return
    if (IO === null) {
      // 如果IO==NULL，说明不支持IntersectionObserver，则直接callback
      return callback(ref.current)
    }
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

示例：

```tsx
import AntdAvatar, { AvatarProps } from 'antd/lib/avatar'
import React, { useState } from 'react'
import { useUpdateEffect } from 'react-use'

export interface Avatar extends AvatarProps {
  src?: string
  lazy?: boolean
}

export const Avatar = ({ src, lazy = false, ...props }: Avatar) => {
  const [display, setDisplay] = useState<string>(lazy ? null : src)

  useUpdateEffect(() => {
    setDisplay(src)
  }, [src])

  const ref = useIntersection(() => {
    setDisplay(src)
  }, lazy)

  return <AntdAvatar ref={ref} {...props} src={display} />
}

const avatar = <Avatar src="xxx" lazy />
```
