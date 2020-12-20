### bindActionCreators源码阅读

> 删掉了很多非核心代码。稍微重构了下。保留清晰的核心逻辑。

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

貌似一眼康不出它想要做什么。

这里有一个好康的Demo。

```ts
const TodoActionCreators = {
  addTodo: text => ({type: 'ADD_TODO', text}),
  removeTodo: text => ({type: 'REMOVE_TODO', text})
} as const

boundActionCreators = bindActionCreators(TodoActionCreators, store.dispatch)
```

bindActionCreators遍历TodoActionCreators中每个actionCreator，将它们封装了一层。

bindActionCreator返回了新的actionCreator，接受参数自动dispatch。