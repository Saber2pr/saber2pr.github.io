SetState submits the current component node to the update queue, and then rerender itself and its own child components. The field values that the subcomponent receives from the props also change, and so does the rendering when it is inserted into the jsx.
However, if the subcomponent takes the field in props as the initValue of useState, and then inserts the state into the jsx to render, even if the field changes in the upper layer and is passed down through props, it is still the initValue of useState, which will not change the state!
This is obviously due to the nature of useState. UseState initializes state on fiber, and then takes the value of fiber::state, which does not update fiber::state because the initValue has changed! This is when you need useEffect!
To give an example:
```tsx
export interface Avatar extends AvatarProps {
  pendingSrc?: Promise<string>
}

export const Avatar = ({ src, pendingSrc, ...props }: Avatar) => {
  const [display, setDisplay] = useState(src)

  useEffect(() => {
    if (pendingSrc) {
      pendingSrc.then(setDisplay)
    }
  }, [pendingSrc])

  return <AntdAvatar {...props} src={display} />
}
```
A pendingSrc attribute that can be asynchronous Promise has been added to the Avatar component
1. There is no problem with using it this way:
```tsx
<Avatar src="xxx/xxx.svg" />
<Avatar pendingSrc={fetchImg('xxx/xxx.svg')} />
```
But if you use it like this:
```tsx
const [src, setState] = useState('xxx/aaa.svg')

useEffect(()=> {
  setState('xxx/bbb.svg')
}, [])

<Avatar src={src} />
```
You'll notice Avatar always renders xxx/a.svg, no matter how src changes. This is a fatal problem in component library development.
Now modify the Avatar component:
```tsx
export const Avatar = ({ src, pendingSrc, ...props }: Avatar) => {
  const [display, setDisplay] = useState(src)

  useEffect(() => {
    if (pendingSrc) {
      pendingSrc.then(setDisplay)
    }
  }, [pendingSrc])

  useEffect(() => {
    setDisplay(src)
  }, [src])

  return <AntdAvatar {...props} src={display} />
}
```
This allows you to respond to rendering when the props.src changes.
So, if you develop a component that uses useState and uses the values in props as initValue, be sure to pay attention to whether you need to respond to upper-level changes by using useEffect.