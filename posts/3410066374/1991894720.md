### CombineReducers
> this is the version I implemented.
```ts
export interface Action<T = any> {
  type: T
}

export interface AnyAction extends Action {
  [extraProps: string]: any
}

export type ReducersMapObject<S, A extends Action = AnyAction> = {
  [K in keyof S]: Reducer<S[K], A>
}

export const combineReducers = <S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
) => (state: S, action: A) =>
  (Object.keys(reducers) as (keyof S)[]).reduce(
    (nextState, key) =>
      Object.assign(nextState, {
        [key]: reducers[key](state[key], action)
      }),
    {} as S
  )
```
The import * as reducer code constructs the following objects
```ts
type Reducers = { readonly [reducer: string]: (s: State, a: Action) => State }
```
> tice readonly
Use Object.keys or Object.entries to iterate through each reducer, and enter state [reducer. Name] and action. Generate a new State return.
#### CombineReducers implemented in redux
```js
export default function combineReducers (reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}

  // 从reducers中过滤出function。因为reducers是import * as reducers来的
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  // 拿到reducers名称集合
  const finalReducerKeys = Object.keys(finalReducers)

  return (state = {}, action) => {
    let hasChanged = false
    const nextState = {}

    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      // 拿到key对应的reducer和state
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]

      const nextStateForKey = reducer(previousStateForKey, action)

      nextState[key] = nextStateForKey
      // 浅比较新旧state
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }

    // 是否有reducer动态增删
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length

    // 如果state没有变化，则直接返回
    return hasChanged ? nextState : state
  }
}

```