按需加载 js：

```ts
import { useEffect, useRef, useState } from 'react'

type Cache = {
  dom: HTMLScriptElement
  lib: any
}

const map = new Map<string, Cache>()

export const useLoadScript = <T>(
  name: string,
  src: string,
  deps: any[] = []
): [T, boolean] => {
  const ref = useRef<T>()
  const [loading, setLoading] = useState(true)

  const loadLib = () => {
    const cache = map.get(name) || ({} as Cache)
    cache.lib = window[name]
    map.set(name, cache)
    ref.current = cache.lib
    setLoading(false)
  }

  useEffect(() => {
    const cache = map.get(name) || ({} as Cache)

    if (cache.lib) {
      ref.current = cache.lib
      setLoading(false)
      return
    }

    if (cache.dom) {
      cache.dom.addEventListener('load', loadLib)
      return () => cache.dom.removeEventListener('load', loadLib)
    }

    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.crossOrigin = 'true'

    script.addEventListener('load', loadLib)
    document.body.append(script)

    cache.dom = script
    map.set(name, cache)

    return () => script.removeEventListener('load', loadLib)
  }, deps)
  return [ref.current, loading]
}
```

使用：

```ts
const [Hls, loading] = useLoadScript<Hls>(
  'Hls',
  'https://cdn.jsdelivr.net/npm/hls.js@alpha'
)
```
