### thunk异步Action中间件源码阅读

```ts
function createThunkMiddleware(extraArgument) {
  // thunkMiddleware: middlewareAPI => dispatch => action => any
  return ({ dispatch, getState }) => next => action => {
    // 如果是异步action
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}
```

就是判断了下action的类型，如果是function，就传dispatch和getState进去。

> 中间件只能处理下dispatch和action