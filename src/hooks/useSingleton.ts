import { useRef } from "react"

export const useSingleton = async <T>(lazyValue: () => Promise<T>) => {
  const ref = useRef<T>()
  if (ref.current) return ref.current

  const value = await lazyValue()
  ref.current = value

  return ref.current
}
