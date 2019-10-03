import { useEffect } from "react"

export const useOnScroll = (callback: (event: Event) => void) =>
  useEffect(() => {
    const checkForBottom = (event: Event) => callback(event)
    window.addEventListener("scroll", checkForBottom)
    return () => window.removeEventListener("scroll", checkForBottom)
  })
