### Side effect
React officials say that DOM operations in function components are side effects and need to be done in useEffect.
Misuse:
```tsx
const App = () => {
  document.title = "app"
  return <div>app</div>
}
```
Correct usage:
```tsx
const App = () => {
  useEffect(() => {
    document.title = "app"
  })
  return <div>app</div>
}
```
But in fact, both of these ways can achieve their goals. Then why not recommend the first one?
There are two reasons:
1. The document operation takes time and blocks the construction and rendering of the virtual DOM tree. Placing useEffect will proceed asynchronously, avoiding blocking.
two。 When rendering on the server side, the first method of writing will report an error because the server environment does not have DOM API. Operations placed in useEffect are not performed in renderToString logic.
### Functional programming based on side effects
Effect can also be written in the following form in the above way:
```tsx
const App = () => {
  const setTitle = () => {
    document.title = "app"
  }
  useEffect(() => {
    setTitle()
  })
  return <div>app</div>
}
```
Calculation of side effects:
```tsx
const App = () => {
  // 副作用组合、计算
  const getTitle = () => document.title
  const appendTitle = value => getTitle() + value
  const setTitleHead = () => {
    document.title = appendTitle("-app")
  }
  useEffect(() => {
    setTitle() // 副作用执行
  })
  return <div>app</div>
}
```
In the above example, the execution of the side effect is always wrapped in the function, as long as the outer layer of the function is not executed, the side effect will not be executed.
In functional programming, this structure that isolates and calculates side effects is called Monad.
[Monad in haskell](/blog/Haskell基础/函数式编程基本概念)