ref 第一次（mount）初始化，被赋值给 currentHook.memoizedState；随后 update 阶段，会把 memoizedState 传给新的 hook。

1. memoizedState 在新旧 hook 之间传递:

[ReactFiberHooks.js#L615](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberHooks.js#L615)

```ts
function updateWorkInProgressHook(): Hook {
  ...
  const newHook: Hook = {
      memoizedState: currentHook.memoizedState, // 传递memoizedState
      baseState: currentHook.baseState,
      queue: currentHook.queue,
      baseUpdate: currentHook.baseUpdate,
      next: null
  }
  ...
}
```

2. ref 在 memoizedState 上初始化与获取

[ReactFiberHooks.js#L880](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberHooks.js#L880)

```ts
function mountRef<T>(initialValue: T): { current: T } {
  const hook = mountWorkInProgressHook()
  const ref = { current: initialValue } // 对象
  hook.memoizedState = ref
  return ref
}
```

ref 的类型是{current: any}，对象类型是引用传递，内部的属性 current 不会被拷贝。所以传递的过程中 current 的值不变。

3. 基于此，可以封装一个 usePrevious Hook，用于索引一个不变的值。

```ts
import { useRef, useEffect } from "react"
const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
```
