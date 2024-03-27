### ApplyMiddleware source code reading
If it is TS code, it is easy to understand.
> enhancer forced to be gaudy. Look at the processing of enhancer in createStore, recursively createStore and then filter out the enhancer parameter.
> y not separate the logical implementation of createStore and Store?
```ts
// applyMiddleware: (middlewares) => enhancer
// enhancer: createStore => (reducer, preloadedState) => Store
export default function applyMiddleware(...middlewares) {
  // createStore: (reducer, preloadedState, enhancer) => Store
  return createStore => (...args) => {
    const store = createStore(...args)
    // 设置dispatch默认值。不允许在middleware执行的时候调用dispatch。一个中间件不允许有这种权利。
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }

    // 给每个中间件传入middlewareAPI
    // 得到chain: Array<(dispatch) => (action) => any>
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // compose chain然后传入dispatch，返回dispatch: (action) => any
    dispatch = compose(...chain)(store.dispatch)

    // 返回加强后的store
    return {
      ...store,
      dispatch
    }
  }
}
```