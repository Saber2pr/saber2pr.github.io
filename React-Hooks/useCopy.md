点击复制功能

```ts
import { message } from 'antd'
import ClipboardJS from 'clipboard'
import { DependencyList, useEffect, useRef } from 'react'

export const useCopy = <
  Button extends HTMLElement = any,
  Target extends HTMLElement = any
>(
  init: (cp: ClipboardJS) => void | VoidFunction = cp => {
    cp.on('success', () => message.success('复制成功'))
  },
  deps: DependencyList = []
) => {
  const ref = useRef<Button>()
  const targetRef = useRef<Target>()
  useEffect(() => {
    const targetId = `Clipboard-Target-${Date.now()}`
    if (ref.current) {
      ref.current.setAttribute('data-clipboard-target', `#${targetId}`)
    } else {
      return
    }
    if (targetRef.current) {
      targetRef.current.id = targetId
    } else {
      ref.current.id = targetId
    }
    const cp = new ClipboardJS(ref.current)
    init && init(cp)
    return () => cp.destroy()
  }, deps)
  return {
    button: ref,
    target: targetRef,
  }
}
```

example:

```tsx
const copy = useCopy()

<div ref={copy.target}>内容</div>
<div ref={copy.button}>按钮</div>
```
