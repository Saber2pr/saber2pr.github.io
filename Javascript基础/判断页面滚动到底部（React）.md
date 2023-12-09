原理：document.documentElement.scrollTop + document.documentElement.clientHeight === document.documentElement.scrollHeight 时就是滚到底部了

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
