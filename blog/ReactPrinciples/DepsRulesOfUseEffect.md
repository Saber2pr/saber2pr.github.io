Most useEffect scenarios are used to setState asynchronously, either to read ref asynchronously, or to subscribe to events. However, because react setState raises the component rerender, you need to set the correct deps to avoid repeated execution.
The principle of deps comparison is to use useRef to record the last deps, and then make a comparison.
Simplified version:
```ts
const useEffect = (create: Effect, deps?: readonly any[]) => {
  const fiber = getCurrentWorkInProgress()
  const effect = fiber.memoizedState
  // useRef去记录上一次的deps
  const prevDepsRef = useRef(null)
  if (deps && areHookInputsEqual(deps, prevDepsRef.current)) {
    return
  } else {
    prevDepsRef.current = deps
    fiber.memoizedState = pushEffect(effect, create)
  }
}

// 比较函数
const areHookInputsEqual = (
  nextDeps: readonly any[],
  prevDeps: readonly any[] | null
) => {
  if (prevDeps === null) {
    return false
  }
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    // is函数简单来说就是 a === b
    if (is(nextDeps[i], prevDeps[i])) {
      continue
    }
    return false
  }
  return true
}
```
Note that the deps comparison is shallow.
### Deps setting attention points and the endless cycle caused by useEffect
Deps is a shallow comparison, so the elements in the deps array are preferably primitive types, that is, values are compared. If the deps contains an object, then the reference address of the object is compared, and there is no deep comparison (react does not think it is necessary to make a deep comparison for the sake of performance), and in the react function component, the object will often be reinitialized due to the rerender caused by setState, resulting in repeated execution of useEffect, and if setState is carried out in the useEffect at this time, it will lead to deps changes and endless loop infinite setState.
An example of useEffect that can cause an endless loop:
```ts
const [state, setState] = useState(0)
// 由于setState使组件rerender，obj将重新初始化，引用发生变化
const obj = { id: 0 }

useEffect(() => {
  setState(state + 1)
}, [obj])
```
If you must use an object for deps, you must wrap the obj object with useMemo or useState:
```ts
const obj = useMemo(() => ({ id: 0 }), [])
// const [obj] = useState({ id: 0 })
const [state, setState] = useState(0)

useEffect(() => {
  setState(state + 1)
}, [obj])

// useEffect(() => {
//   setState(state + 1)
// }, [obj.id])
```
Especially for obj sent from props, it is impossible to know whether it has been optimized by useMemo, so it is recommended that deps should be a basic type array! For example, you can use obj.id instead of obj to do deps.