1. Provider.value 发生变化时，将导致子组件中所有 Consumner 重新渲染。

例如：

```tsx
const TextContext = React.createContext()

const Parent = () => (
  // value 每次都接受一个新的对象
  <TestContext.Provider value={{ name: "test" }}>
    <Child />
  </TestContext.Provider>
)

const Child = () => (
  <TestContext.Consumer>{({ name }) => <p>{name}</p>}</TestContext.Consumer>
)
```

在这个例子中，Parent 组件中 TestContext.Provider.value 每次都接受一个新的对象，在 diff 过程中判定为 update，
这将导致 Child 组件中 TestContext.Consumer 重新渲染。

2. 解决办法：

```tsx
const Parent = () => {
  const valueRef = useRef({ name: "test" })
  return (
    <TestContext.Provider value={ref.current}>
      <Child />
    </TestContext.Provider>
  )
}
```

关于这里为什么可以使用 ref，可以参考：

[ref 为什么能保持引用](/blog/React原理/ref为什么能保持引用)
