Principle: document.documentElement.scrollTop + document.documentElement.clientHeight = document.documentElement.scrollHeight is rolled to the bottom
```ts
// 监听滚动hook
export const useOnScroll = (callback: (event: Event) => void) =>
  useEffect(() => {
    const checkForBottom = (event: Event) => callback(event)
    window.addEventListener("scroll", checkForBottom)
    return () => window.removeEventListener("scroll", checkForBottom)
  })

// 监听滚动触底hook
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
```