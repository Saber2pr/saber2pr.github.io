useEffect大部分场景都是用于异步地setState，或者是异步地读取ref，或者是进行订阅事件。但是由于react setState会引发组件rerender，所以需要设置正确的deps避免重复执行。

deps比较的原理，就是利用了useRef去记录上一次的deps，然后做比较。

简化版：

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

注意这个deps的比较是浅比较。

### deps设置注意点与useEffect引起的死循环

deps是浅比较，所以deps数组中的元素最好是基本类型，也就是以值作比较。如果deps中包含了对象，那么比较的是对象的引用地址，并不会深比较（react为了性能认为没有必要去深比较），而且在react函数组件中，对象经常会因为setState引起的rerender而重新初始化导致引用变化，造成useEffect重复执行，如果此时useEffect中又进行了setState则又会导致deps变化而引起死循环无限setState。

会引起死循环的useEffect示例：

```ts
const [state, setState] = useState(0)
// 由于setState使组件rerender，obj将重新初始化，引用发生变化
const obj = { id: 0 }

useEffect(() => {
  setState(state + 1)
}, [obj])
```

如果一定要用对象做deps，必须使用useMemo或者useState包裹obj对象：

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

特别是从props上传来的obj，更无法知道它是不是已经经过useMemo优化，所以建议deps最好是基本类型数组！例如可以用obj.id代替obj做deps。