### createStore源码阅读

> 删掉了很多非核心代码。稍微重构了下。保留清晰的核心逻辑。

```ts
export default function createStore(reducer, preloadedState, enhancer) {
  // 如果有中间件，则应用加强
  if (typeof enhancer !== 'undefined') {
    return enhancer(createStore)(reducer, preloadedState)
  }

  let currentState = preloadedState
  const currentListeners = [] // 订阅者列表

  function getState() {
    return currentState
  }

  function subscribe(listener) {
    currentListeners.push(listener)
    return () => 
      currentListeners.splice(currentListeners.indexOf(listener), 1)
  }

  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(l => l())
    return action
  }

  dispatch({ type: ActionTypes.INIT })
  return {
    dispatch,
    subscribe,
    getState
  }
}
```

就是个观察者模式很容易理解，不多说了。