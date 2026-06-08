1. When the Provider.value changes, it will cause all Consumner in the sub-component to re-render.
For example:
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
In this example, the TestContext.Provider.value in the Parent component accepts a new object each time, which is determined to be update during the diff process
This will cause TestContext.Consumer in the Child component to re-render.
two。 Solution:
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
For information about why you can use ref here, you can refer to:
[Why can ref keep references](/blog/React原理/ref为什么能保持引用)