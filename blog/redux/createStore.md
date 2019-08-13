### createStore源码阅读

> 删掉了很多非核心代码。稍微重构了下。保留清晰的核心逻辑。

```ts
export default function createStore (reducer, preloadedState, enhancer) {
  // 如果有中间件，则应用加强
  if (typeof enhancer !== 'undefined') {
    return enhancer(createStore)(reducer, preloadedState)
  }

  let currentReducer = reducer
  let currentState = preloadedState
  const currentListeners = [] // 订阅者列表

  const getState = () => currentState

  function subscribe (listener) {
    currentListeners.push(listener)
    return () => currentListeners.splice(currentListeners.indexOf(listener), 1)
  }

  function dispatch (action) {
    currentState = currentReducer(currentState, action)
    currentListeners.forEach(l => l())
    return action
  }

  function replaceReducer (nextReducer) {
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.REPLACE })
  }

  // observable，当store state变化时自动通知observer
  // 就是subscribe: observer => store.subscribe(() => observer.next(store.getState()))
  // 相当于一个语法糖
  function observable () {
    const outerSubscribe = subscribe
    return {
      subscribe (observer) {
        const observeState = () => observer.next && observer.next(getState())
        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable] () {
        return this
      }
    }
  }

  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

就是个观察者模式很容易理解，不多说了。