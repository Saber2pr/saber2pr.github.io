import { useEffect, useRef, useState } from 'react'

export const useLoadScript = <T>(
  name: string,
  src: string,
  deps: any[] = []
): [React.MutableRefObject<T>, boolean] => {
  const ref = useRef<T>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.crossOrigin = 'true'
    script.onload = () => {
      ref.current = window[name]
      setLoading(false)
    }
    document.body.append(script)
  }, deps)
  return [ref, loading]
}
