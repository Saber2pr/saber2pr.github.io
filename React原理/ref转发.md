在 React 中获取真实 DOM 可以通过 ref。

```tsx
const Input = () => {
  const ref = useRef()

  useEffect(() => {
    ref.current.value // dom操作
  })

  return <input ref={ref} />
}
```

ref 的初始化在视图渲染完成后进行。所以需要在 useEffect 中读取。

但是对于 Input 组件外部，怎么访问其内部的 input 真实 DOM 呢？

如果这样：

```tsx
const Form = () => {
  const parentRef = useRef()
  return (
    <form>
      <Input ref={parentRef} />
    </form>
  )
}
```

然后在 Input 内，通过 props 拿到 parentRef 再赋给 input:ref 可以吗？

答案是不行。因为 props 里不会传递 ref，即使传了，也无法正常使用。

Input 组件需要利用 React.forwardRef 进行 ref 转发。

```tsx
const Input = React.forwardRef((props, parentRef) => {
  const ref = useRef()

  useEffect(() => {
    ref.current.value // dom操作
  })

  return <input ref={ref} />
})
```

现在又一个问题，parentRef 怎么处理？

> forwardRef 传递的 parentRef 为 React.Ref 类型，没有 current 属性！

```tsx
const Input = React.forwardRef((props, parentRef) => {
  const ref = useRef()

  useEffect(() => {
    ref.current.value // dom操作
  })

  useImperativeHandle(parentRef, () => ({
    blur: () => ref.current.blur()
  }))

  return <input ref={ref} />
})
```

这样就行了。需要借助 useImperativeHandle 来关联两个 ref 的行为。

源码里，useImperativeHandle 的实现就是同步阶段给 ref.current 赋值第二个参数的返回值，然后在 useEffect（异步）里读取。

[facebook/react/react-reconciler/ReactFiberHooks.js#L1009](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberHooks.js#L1009)
