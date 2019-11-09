import { useEvent } from "./useEvent"
import { useMemo } from "react"

export const useOnScrollBottom = (callback: (event: Event) => void) => {
  const container = useMemo(() => document.documentElement, [])
  useEvent("scroll", event => {
    if (
      container.scrollTop + container.clientHeight ===
      container.scrollHeight
    ) {
      callback(event)
    }
  })
}
