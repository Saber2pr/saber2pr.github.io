import { useEvent } from "./useEvent"

export const useOnScrollBottom = (callback: (event: Event) => void) => {
  const container = document.documentElement
  useEvent("scroll", event => {
    if (
      container.scrollTop + container.clientHeight ===
      container.scrollHeight
    ) {
      callback(event)
    }
  })
}
