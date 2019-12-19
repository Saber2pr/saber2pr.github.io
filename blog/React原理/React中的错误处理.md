### React 中的错误处理

1. 在 workLoop 大循环统一捕获，

```js
try {
  workLoop()
} catch (error) {
  handleError(error)
}

function handleError(error) {
  throwException(error)
}
```

源码位置
https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberWorkLoop.js#L692

handleError 中调用了 throwException，所以主要看 throwException 实现：(简化，只展示了 class 和 host 组件)

```js
function throwException(fiber, errorInfo) {
  let workInProgress = fiber
  while (workInProgress) {
    switch (workInProgress.tag) {
      case HostRoot: {
        createRootErrorUpdate(workInProgress, errorInfo)
        return
      }
      case ClassComponent:
        const ctor = workInProgress.type
        const instance = workInProgress.stateNode
        if (
          typeof ctor.getDerivedStateFromError === "function" ||
          typeof instance.componentDidCatch === "function"
        ) {
          createClassErrorUpdate(workInProgress, errorInfo)
        }
        break
    }
    workInProgress = workInProgress.return
  }
}
```

原理就是利用 fiber.return 链表，查找父级 class 组件是否实现了 componentDidCatch 方法。
createClassErrorUpdate 内部调用了 logError 方法，用于打印组件树，原理还是 fiber.return 向上，收集组件的 displayName。

关于 hook 组件是找父级的 Suspense fallback，用于错误回滚。
