### 副作用

React 官方称，在函数组件中的 DOM 操作属于副作用，需要在 useEffect 中进行。

错误用法：

```tsx
const App = () => {
  document.title = "app"
  return <div>app</div>
}
```

正确用法：

```tsx
const App = () => {
  useEffect(() => {
    document.title = "app"
  })
  return <div>app</div>
}
```

但实际上这两种方式都可以达到目的。那为什么不推荐第一种呢？

原因有两点：

1. document 操作花费时间较多，会阻塞虚拟 DOM 树的构建和渲染。放在 useEffect 会异步进行，避免了阻塞。

2. 在服务端渲染时，第一种写法会报错，因为服务端环境没有 DOM API。放在 useEffect 中的操作在 renderToString 逻辑中不会执行。

### 基于副作用的函数式编程

上面的写法中 Effect 也可以写成以下形式：

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

副作用计算：

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

在上面的例子中，副作用的执行始终被包裹在函数中，只要外面这层函数不执行，副作用就不会执行。

在函数式编程中，这种能够对副作用进行隔离和计算的结构称为 Monad。

[haskell 中的 Monad](/blog/Haskell基础/函数式编程基本概念)
