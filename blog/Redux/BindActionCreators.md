### BindActionCreators source code reading
> lot of non-core code has been removed. A little reconstruction. Keep the core logic clear.
```ts
function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(args))
}

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  return Object.keys(actionCreators).reduce((boundActionCreators, key) => {
    boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    return boundActionCreators
  }, {})
}
```
It doesn't seem to tell what it wants to do at a glance.
Here is a good Demo.
```ts
const TodoActionCreators = {
  addTodo: text => ({type: 'ADD_TODO', text}),
  removeTodo: text => ({type: 'REMOVE_TODO', text})
} as const

boundActionCreators = bindActionCreators(TodoActionCreators, store.dispatch)
```
bindActionCreators iterates over each actionCreator in TodoActionCreators, encapsulating them in a layer.
BindActionCreator returned a new actionCreator and accepted the parameter automatic dispatch.