1. 不需要 redux-thunk

由于 react16 之前没有 hooks，所以难以在组件外部使用 setState，如果想将业务逻辑从视图层抽离出去，需要使用 async actions，就是函数形式的 action。在 action 里写逻辑。
而有了 hooks 之后，完全可以自定义 hooks 来封装业务逻辑。

2. 不需要 Immutablejs

推荐使用扁平化的 state，当 state 扁平化后，reducer 可以省略了，redux 变成了全局的 setState。reducer 可以写成这样：

```ts
export type IState = Readonly<{
  count: number
}>
export type IAction<K extends keyof IState = keyof IState> = {
  type: K
  payload: IState[K]
}

export const initState: IState = {
  count: 0,
}
export const reducer: Reducer<IState, IAction> = (
  state,
  { type, payload }
) => ({ ...state, [type]: payload })

const store = createStore(reducer, initState)
```

3. 可能不需要 redux

react useState 依赖组件 fiber，所以 useState 不可以实现状态全局化，只能选择状态提升，但是状态提升不利于性能。redux 用来管理全局状态，将状态与需要的组件进行绑定。可以将 redux 看作是 observable，修改 redux-state 将通知组件更新。
如果淡化 redux 的 全局性和 reducer，将很快发现 redux 可以被 hooks 替代，使用一个变量实现 observable 然后与 useState 绑定即可。例如直接使用 rxjs observable，利用操作符可以更细致地处理异步更新流程，也可以只当一个创建 observable value 的工具来用，需要绑定状态的组件可以通过 context 注入 observable。（对于 redux 是顶层注入）

redux 的缺点很明显，绑定 redux-state 的组件将与 redux 耦合，无法复用。这也是依赖全局状态管理的代价。如果考虑局部状态管理，每个组件管理自己的状态可以考虑 useReducer 或者拥有强大操作符的 rxjs，局部状态管理可以提高组件的复用性，缺点就是难以调试和跟踪。

具体需要用全局还是局部状态管理，依项目业务复杂度而定。
