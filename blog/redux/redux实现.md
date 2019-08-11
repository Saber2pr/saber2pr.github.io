redux实现就是一个对State的观察者模式。

> 比较容易实现此处就不写了

### combineReducers

说下combineReducers

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

import * as reducer这句代码会构造如下对象

```ts
type Reducers = { readonly [reducer: string]: (s: State, a: Action) => State }
```

> 注意到readonly

使用Object.keys或者Object.entries遍历每个reducer，并输入state[reducer.name]和action。生成新的State返回。
