import { useRef, useEffect } from "react"

export const useValue = <T>(value: () => T, deps = []) => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value()
  }, deps)

  return ref.current
}
