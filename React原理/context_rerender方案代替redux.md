原理是顶层setState，setState通过context传递

```tsx
type IContext = {
  count: number
  update: (partialState: Partial<IContext>) => void
}

const Context = React.createContext<IContext>(null)

const Parent = () => {
  const [ctx, updateCtx] = useState<IContext>({
    count: 0,
    update: partialState => updateCtx({ ...ctx, ...partialState }),
  })

  return (
    <Context.Provider value={ctx}>
      <Child />
    </Context.Provider>
  )
}

const Child = () => {
  const { count, update } = useContext(Context)
  return (
    <div>
      <div>count: {count}</div>
      <div onClick={() => update({ count: count + 1 })}>update</div>
    </div>
  )
}
```
