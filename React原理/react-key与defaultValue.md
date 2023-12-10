在 react 组件中，经常有 defaultValue 这个属性，这个属性基本实现为：

```tsx
const Component = ({ defaultValue }) => {
  const [value, setValue] = useState(defaultValue)
  return <>{value}</>
}

const App = ({ data }) => {
  return <Component defaultValue={data.content} />
}
```

你会发现，不论 data.content 如何变化，Component 中的 defaultValue 都不会更新，之前我讨论过一篇：

[useState 使用 props 初始化的注意点](/blog/React原理/useState使用props初始化的注意点)

是用 useEffect 去更新。但是，不能保证所有的库都去实现这个。

但是可以借助 react-key 来实现更新！

react-key 在组件 diff 过程中，如果 key 发生了变化，react 会首先在 childrenKeyMap 里找，如果找到，就可以复用，例如列表节点顺序变化。如果没有找到，说明组件销毁。

所以只要加一个 key，值等于 defaultValue 的值就可以了！

```tsx
const App = ({ data }) => {
  return <Component defaultValue={data.content} key={data.content} />
}
```

这样，当 data.content 变化时，key 发生了变化，diff 过程中该组件的 fiber 就会被删除并重新构造生成！defaultValue 自然也会更新！当然，前提是兄弟组件中没有找到相同 key 的！
