### Thunk Asynchronous Action Middleware Source Code Reading
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
Is to judge the type of action, if it is function, send dispatch and getState into it.
> middleware can only handle dispatch and action