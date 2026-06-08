Look at what these two API have done behind their backs.
Let's talk about the conclusion first.
### What did useSelector do?
> listeners are registered on the store when this Hook API is called.
> when the Store::state changes, the component will checkForUpdates and use equalityFn to determine whether to update.
#### Two feature:
1. Subscribe to Store. When state changes, mapState automatically, and the returned childState will be rendered to the view.
2. EqualityFn is equivalent to shouldComponentUpdate
#### Deficiency
There is no memorize optimization for the selector function
Can I use useCallback to optimize selector?
I can't. The input parameter for selector is Store::State. Since react-redux is used, try not to access store, while useCallback requires deps, that is, Store::State (for selector, the input parameter). There is no way to get it directly.
The solution is to use reselect to memorize selector. (judge the input parameter of selector)
### What did reselect do?
> morize optimization of selector function (equivalent to mapXXXToProps function)
> if the input parameter of selector has not changed, the cache of the last execution is returned.
### Source code details
#### UseSelectorWithStoreAndSubscription
> e core of the useSelector function in the React-Redux library
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
#### CreateSelectorCreator
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
The source code is relatively simple, mainly take a look at the memorize part
#### DefaultMemoize
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
### The deficiency of memorize in reselect
The default memorize function in reselect relies on closures for caching, but the disadvantage is that it cannot be recorded multiple times.
How can I record it many times? For instance
Memo Optimization of compilePath in react-router Library
[MatchPath.js#L4](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js#L4)
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
If the path parameter has a corresponding cache record, the cache is returned directly. It can be recorded many times, and the maximum limit is 10k different path (there won't actually be so many routes). It belongs to the optimization strategy of changing space for time.
### How to use useSelector correctly
First of all, components that use useSelector subscribe to the store (useSelector is an alternative to connect). The second parameter of useSelector is equivalent to shouldComponentUpdate.
The return value obtained by using useSelector needs to be updated by calling dispatch. (see useDispatch)
Then, useSelector does not avoid repeated execution of the selector function. The selector function needs to be optimized using the reselect library.