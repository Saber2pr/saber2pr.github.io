The first (mount) initialization of the ref, which is assigned to the currentHook.memoizedState; and then the update phase, passes the memoizedState to the new hook.
1. MemoizedState is passed between the new and old hook:
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
2. Initialization and acquisition of ref on memoizedState
[ReactFiberHooks.js#L880](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberHooks.js#L880)
```ts
function mountRef<T>(initialValue: T): { current: T } {
  const hook = mountWorkInProgressHook()
  const ref = { current: initialValue } // 对象
  hook.memoizedState = ref
  return ref
}
```
The type of ref is {current: any}, the object type is reference passing, and the internal property current is not copied. So the value of current remains the same during the process of passing.
3. Based on this, you can encapsulate a usePrevious Hook to index a constant value.
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