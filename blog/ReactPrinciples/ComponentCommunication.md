### The child component calls the parent component
1. Use props data streams (one-way downward)
```tsx
const Parent = () => {
  const [state, setState] = useState(0)
  return <Child update={setState} />
}

const Child = ({ update }) => (
  <button onClick={() => update(233)}>update</button>
)
```
two。 Use Context
```tsx
const Context = React.createContext()

const Parent = () => {
  const [state, setState] = useState(0)
  return (
    <Context.Provider value={{ update: setState }}>
      <Child />
    </Context.Provider>
  )
}

const Child = () => (
  <Context.Consumer>
    {({ update }) => <button onClick={() => update(233)}>update</button>}
  </Context.Consumer>
)
```
Or
```tsx
const Context = React.createContext()

const Parent = () => {
  const [state, setState] = useState(0)
  const context = useContext(Context)
  context.update = setState
  return <Child />
}

const Child = () => {
  const { update } = useContext(Context)
  return <button onClick={() => update(233)}>update</button>
}
```
### Parent component invokes child component
Use ref
```tsx
const Parent = () => {
  const ref = useRef()

  useEffect(() => {
    ref.current.update(233)
  })

  return <Child ref={ref} />
}

const Child = React.forward((props, ref) => {
  const [state, setState] = useState(0)

  useImperativeHandle(ref, () => ({
    update: setState
  }))

  return <p>{state}</p>
})
```
### sibling communication
Because of the characteristics of React unidirectional data flow, the data can only be transferred from top to bottom. So the component needs to call the parent component setState to publish the new data to the sibling component.
```tsx
const Parent = () => {
  const [state, setState] = useState(0)
  return (
    <>
      <Child1 update={setState} />
      <Child2 state={state} />
    </>
  )
}

const Child1 = ({ update }) => (
  <button onClick={() => update(233)}>update child2</button>
)

const Child2 = ({ state }) => <p>{state}</p>
```
### redux
There is no inevitable relationship between redux and react. Redux is an implementation of the Observer pattern + compose. The above example shows that the data is passed to the view one-way, and the data transfer needs to be triggered by events, that is, the view is the subscriber of the data, the data changes and the view changes accordingly. So redux and react can work well together. However, redux events trigger relatively frequently, if not optimized, react will do a lot of useless rerender logic, so in the react-redux library, the subscriber of subscription data is optimized, reducing a lot of rerender.
[Optimizations made by react-redux](/blog/React生态/React-Redux干了什么)
As for the need to introduce redux, in fact, think carefully, the use of context, ref is sufficient.