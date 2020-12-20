在 react 中订阅 dom 事件需要在 useEffect 中进行，effect hook 会在组件卸载时清理清理订阅。

如果每次订阅都要写 addEventListener 和 removeEventListener 未免也太麻烦了 8，所以可以把这个封装为一个 useEvent 的 Hook 组件：

```ts
export const useEvent = <K extends keyof WindowEventMap>(
  type: K,
  callback: (event: WindowEventMap[K]) => void,
  deps?: readonly any[]
) =>
  useEffect(() => {
    const handle = (event: WindowEventMap[K]) => callback(event)
    window.addEventListener(type, handle)
    return () => window.removeEventListener(type, handle)
  }, deps)
```

> WindowEventMap 接口定义了 DOM Event 的类型和对应的属性。

[完整代码](https://github.com/Saber2pr/saber2pr.github.io/blob/master/src/hooks/useEvent.ts)
