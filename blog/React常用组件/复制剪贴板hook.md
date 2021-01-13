```ts
import ClipboardJS from 'clipboard'
import { DependencyList, useEffect, useRef } from 'react'

export const useCopy = <
  Button extends HTMLElement = any,
  Target extends HTMLElement = any
>(
  init?: (cp: ClipboardJS) => void | VoidFunction,
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

使用:

```tsx
const App = () => {
  // 1
  const copy = useCopy(cp => {
    cp.on('success', () => message.success('复制成功'))
  })
  // 2
  const copySelf = useCopy()
  return (
    <div>
      <div ref={copy.target}>这是内容</div>
      <div ref={copy.button}>点击复制到剪贴板</div>
      <div ref={copySelf.button}>点击复制此内容</div>
    </div>
  )
}
```
