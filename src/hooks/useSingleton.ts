import { useRef } from 'react'

export const useSingleton = <T>(lazyValue: () => Promise<T>) => {
  const ref = useRef<T>()
  if (ref.current) return async () => ref.current

  return async () => {
    const value = await lazyValue()
    ref.current = value
    return ref.current
  }
}
