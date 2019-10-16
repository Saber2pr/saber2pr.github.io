import { useEffect } from "react"

export const useEvent = <K extends keyof WindowEventMap>(
  type: K,
  callback: (event: WindowEventMap[K]) => void,
  deps?: any[]
) =>
  useEffect(() => {
    const handle = (event: WindowEventMap[K]) => callback(event)
    window.addEventListener(type, handle)
    return () => window.removeEventListener(type, handle)
  }, deps)
