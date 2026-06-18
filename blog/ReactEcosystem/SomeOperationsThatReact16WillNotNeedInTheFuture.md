1. No need for redux-thunk
Since there are no hooks before reaction 16, it is difficult to use setState outside the component. If you want to extract business logic from the view layer, you need to use async actions, which are actions in the form of functions. Write logic in action.
With hooks, you can customize hooks to encapsulate business logic.
two。 No need for Immutablejs
Flat state is recommended. When state is flat, reducer can be omitted and reducux becomes global setState. The reducer can be written like this:
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
3. Redux may not be required
React useState depends on the component fiber, so useState can not achieve state globalization, can only choose state promotion, but state improvement is not conducive to performance. Redux is used to manage the global state and bind the state to the required components. You can think of redux as an observable, and modifying the redux-state will notify the component of the update.
If you play down the overall nature of redux and reducer, you will soon find that redux can be replaced by hooks, using a variable to implement observable and then bind to useState. For example, using rxjs observable directly, operators can be used to deal with the asynchronous update process in more detail, or it can only be used as a tool for creating observable value, and components that need bound state can be injected into observable through context. (top-level injection for redux)
The drawback of redux is obvious: components bound to redux-state will be coupled to redux and cannot be reused. This is also the price of relying on global state management. If you consider local state management, each component can consider useReducer or rxjs with powerful operators to manage its own state. Local state management can improve the reusability of components, but it is difficult to debug and track.
The specific need to use global or local state management, depending on the project business complexity.