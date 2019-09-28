看看这两个 API 背地里干了什么 (

先说结论

### useSelector 干了什么

> 调用此 Hook API 时会在 store 上注册监听器。
> 当 Store::state 变化时，组件会 checkForUpdates，利用 equalityFn 判断是否进行更新。

#### 两个 feature:

1. 订阅 Store，当 state 变化时，自动 mapState，返回的 childState 会被渲染到视图上
2. equalityFn 等效于 shouldComponentUpdate

#### 不足的地方

没有对 selector 函数做 memorize 优化

可以利用 useCallback 优化 selector 吗？

不能。selector 的入参是 Store::State，既然使用了 react-redux 就尽量不要访问 store，而 useCallback 需要 deps，即 Store::State (对于 selector 就是入参)，这里没有办法直接拿到。

解决方案，使用 reselect 对 selector 做 memorize 处理。(对 selector 入参做判断)

### reselect 干了什么

> 对 selector 函数(等效于 mapXXXToProps 函数)做 memorize 优化
> 如果 selector 的入参没有发生变化，则返回上一次执行的缓存

### 源码细节

#### useSelectorWithStoreAndSubscription

> React-Redux 库中 useSelector 函数的核心部分

```js
// selector:(storeState) => childState
// equalityFn: <T>(newChildState:T, oldChildState:T) => boolean
// useSelectorWithStoreAndSubscription:
// <T>(selector: (storeState) => T, equalityFn: (newProps:T, oldProps:T) => boolean, ...) => T
// 对于Provider使用store，下层组件使用contextSub。
function useSelectorWithStoreAndSubscription(
  selector,
  equalityFn,
  store,
  contextSub
) {
  // forceUpdate
  const [, forceRender] = useReducer(s => s + 1, 0)

  const subscription = useMemo(() => new Subscription(store, contextSub), [
    store,
    contextSub
  ])

  const latestSelector = useRef() // selector的引用
  const latestSelectedState = useRef() // mapStateToProps之后得到的State的引用

  let selectedState

  // 这里和connectAdvanced中计算actualChildProps的道理一样
  if (selector !== latestSelector.current) {
    // selector类似mapStateToProps
    selectedState = selector(store.getState())
  } else {
    // selector没变化，则使用缓存
    selectedState = latestSelectedState.current
  }

  useEffect(() => {
    latestSelector.current = selector
    latestSelectedState.current = selectedState
  })

  useEffect(() => {
    function checkForUpdates() {
      // 执行selector即mapStateToProps
      const newSelectedState = latestSelector.current(store.getState())

      // 比较新旧State即 shouldComponentUpdate
      if (equalityFn(newSelectedState, latestSelectedState.current)) {
        return // shouldComponentUpdate判断为state没变化 则放弃这次update
      }

      latestSelectedState.current = newSelectedState

      // forceUpdate
      forceRender({})

      // 说一下为什么是`force`
      // setState函数只有传入新的值才会re-render
      // 例如setState(array.reverse())，这个不会引起update，因为Array.prototype.reverse不纯
      // 这里强制传入了一个新对象，即setState({})，必定会引起update
    }

    // checkForUpdates注册到Provider::subscription
    // 为什么是Provider？请看components/Provider.js
    // 不严格的讲，也可以说是注册到store listeners里
    subscription.onStateChange = checkForUpdates
    subscription.trySubscribe()

    // 初始化selector更新一次
    checkForUpdates()

    return () => subscription.tryUnsubscribe() // 清理effect。取消订阅
  }, [store, subscription])

  return selectedState
}
```

#### createSelectorCreator

```js
// memoize: (func, equalityCheck) => (...args) => Result
// createSelectorCreator: (memorize, ...memoizeOptions) =>
//   (...inputSelectors, resultFunc) => State => Result
export function createSelectorCreator(memoize, ...memoizeOptions) {
  // funcs: [[inputSelectors], resultFunc]
  // funcs: [...inputSelectors, resultFunc]
  return (...funcs) => {
    let recomputations = 0

    // 拿到funcs中最后一个函数
    const resultFunc = funcs.pop()

    // funcs: [inputSelectors] | [[inputSelectors]]
    // dependencies: InputSelector[] = funcs
    const dependencies = getDependencies(funcs)

    // 得到resultFunc经过memorize优化后的版本
    const memoizedResultFunc = memoize((...args) => {
      recomputations++
      return resultFunc(...args)
    }, ...memoizeOptions)

    // 每个inputSelector的入参都是相同的
    // 所以将所有inputSelectors的入参统一起来做memorize优化
    const selector = memoize((...args) => {
      const params = []
      const length = dependencies.length

      for (let i = 0; i < length; i++) {
        // 遍历每个inputSelector执行
        // 并将结果收集到params里
        params.push(dependencies[i](...args))
      }

      // 将收集到的params传给resultFunc执行
      // 返回resultFunc执行后的结果
      return memoizedResultFunc(...params)
    })

    selector.resultFunc = resultFunc
    selector.dependencies = dependencies
    selector.recomputations = () => recomputations
    selector.resetRecomputations = () => (recomputations = 0)
    return selector
  }
}
```

源码比较简单，主要看看 memorize 部分

#### defaultMemoize

```js
// 对函数func进行memorize优化
// 利用equalityCheck对入参做缓存验证
// defaultMemoize: (func, equalityCheck) => (...args) => Result
export function defaultMemoize(func, equalityCheck = defaultEqualityCheck) {
  let lastArgs /**: any[] **/ = null
  let lastResult /**: any[] **/ = null
  return (...args) => {
    // 利用比较函数equalityCheck对比lastArgs和args(两个数组)
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, args)) {
      // 如果不一致，则重新执行func
      lastResult = func(args)
    }

    // 如果lastArgs和args一致
    lastArgs = args

    // 返回闭包中的缓存
    return lastResult
  }
}

// 两个数组之间的diff
// 利用比较函数equalityCheck对比prev和next
// equalityCheck: (prev: any, next: any) => boolean
// areArgumentsShallowlyEqual: (equalityCheck, prevs: any[], nexts: any[]) => boolean
function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false
  }

  const length = prev.length
  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false
    }
  }

  return true
}
```

### reselect 中 memorize 的不足

在 reselect 中默认的 memorize 函数依靠闭包来做缓存，缺点是不能记录多次。

怎么才能记录多次呢？举个例子

在 react-router 库中 compilePath 的 memo 优化

[matchPath.js#L4](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js#L4)

```js
const cache = {}
const cacheLimit = 10000 // 缓存最大限制
let cacheCount = 0

function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {})

  // memorize优化
  if (pathCache[path]) return pathCache[path]

  // 省略n多代码...
}
```

如果 path 参数有对应的缓存记录，则直接返回缓存。这里可以记录很多次，最大上限是 10k 个不同的 path(实际上不会有这么多的路由)。属于空间换时间的优化策略。

### 如何正确使用 useSelector

首先知道，使用了 useSelector 的组件就会订阅 store（useSelector 是 connect 函数的替代品）。useSelector 第二个参数相当于 shouldComponentUpdate。

使用了 useSelector 得到的返回值需要通过调用 dispatch 来更新。(参见 useDispatch)

然后，useSelector 不会避免 selector 函数重复执行。需要使用 reselect 库对 selector 函数做优化。
