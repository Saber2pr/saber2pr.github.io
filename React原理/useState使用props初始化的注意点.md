setState 会将当前组件节点提交到更新队列中，然后 rerender 自身以及自身子组件。子组件从 props 接收的字段值也会随之变化，然后插入到 jsx 中渲染也会变化。

但是，如果子组件将 props 中的字段作为了 useState 的 initValue，然后将 state 插入到 jsx 中渲染，这个字段即使在上层发生了变化通过 props 传下来，依然是作为 useState 的 initValue, 这将不会更改 state！

这显然是因为 useState 的特性导致的，useState 在 fiber 上初始化了 state，后续取的都是 fiber::state 的值，它不会因为 initValue 发生了变化而去更新 fiber::state ！这时就需要 useEffect ！

举一个例子：

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

给 Avatar 组件添加了可以是异步 Promise 的 pendingSrc 属性，

1. 这样用是没有问题的：

```tsx
<Avatar src="xxx/xxx.svg" />
<Avatar pendingSrc={fetchImg('xxx/xxx.svg')} />
```

但是如果这样用它：

```tsx
const [src, setState] = useState('xxx/aaa.svg')

useEffect(()=> {
  setState('xxx/bbb.svg')
}, [])

<Avatar src={src} />
```

你会发现 Avatar 渲染出来的总是 xxx/aaa.svg，无论 src 怎么变化。这是组件库开发的一个致命问题。

现在修改 Avatar 组件：

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

这样当 props.src 发生变化时，就可以响应渲染。

所以，如果开发一个组件使用了 useState，并且使用了 props 中的值来作为 initValue，一定注意是否需要响应上层变化即使用 useEffect。
