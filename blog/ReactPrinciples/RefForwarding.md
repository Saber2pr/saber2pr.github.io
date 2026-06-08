Getting the real DOM in React can be done via ref.
```tsx
const Input = () => {
  const ref = useRef()

  useEffect(() => {
    ref.current.value // dom操作
  })

  return <input ref={ref} />
}
```
Initialization of the ref occurs after the view rendering is complete. So it needs to be read in useEffect.
But for the outside of an Input component, how do you access its internal input real DOM?
If so:
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
Then in Input, can you get the parentRef through props and assign it to input:ref?
The answer is no. Because ref can not be passed in props, even if it is passed, it cannot be used normally.
Input components need to use React.forwardRef for ref forwarding.
```tsx
const Input = React.forwardRef((props, parentRef) => {
  const ref = useRef()

  useEffect(() => {
    ref.current.value // dom操作
  })

  return <input ref={ref} />
})
```
Now another question, how does parentRef deal with it?
> the parentRef passed by forwardRef is of type React.Ref and has no current attribute!
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
That's it. You need to use useImperativeHandle to correlate the behavior of two ref.
In the source code, the implementation of useImperativeHandle is to assign the return value of the second parameter to ref.current in the synchronous phase, and then read it in useEffect (asynchronous).
[Facebook/react/react-reconciler/ReactFiberHooks.js#L1009](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberHooks.js#L1009)