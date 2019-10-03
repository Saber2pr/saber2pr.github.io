import { useOnScroll } from "./useOnScroll"

export const useOnScrollBottom = (callback: (event: Event) => void) => {
  const container = document.documentElement
  useOnScroll(event => {
    if (
      container.scrollTop + container.clientHeight ===
      container.scrollHeight
    ) {
      callback(event)
    }
  })
}
