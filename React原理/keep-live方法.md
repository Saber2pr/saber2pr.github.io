Ref Hook 存储的值在 React 应用整个生命周期内是不会变的。新旧 workInProgress 的交替中，ref 会作为对象传递，而对象传递不发生拷贝。所以利用这一点可以简单地实现单例模式，利用 ref 存储单例实例。单例模式可以实现类似 memorize 的效果，比如需要对一个状态进行 keep live，保持其活性，避免重复运算、重复请求等，就可以利用单例模式，初始化一次，后续访问的永远是第一次创建的对象，即保持了对象的引用。在 React 组件内，单例模式非常重要，因为对于每个组件都是一个函数，如果不进行优化，会造成大量重复运算，状态每次重新初始化即不连续（没有上下文），所以在 keep live 这一点上，Ref Hook 有非常重要的作用。值得一提的是，Ref Hook 和 State Hook 的关系，Ref Hook 就是利用 State Hook 实现的，只不过 state 类型为{current:any}，而且两者的状态都存储在 fiber.memoizedState 上。所以 State Hook 也拥有上下文。

例如实现一个单例 Hook：

```ts
const useSingleton = async <T>(lazyValue: () => Promise<T>) => {
  const ref = useRef<T>()
  if (ref.current) return ref.current

  const value = await lazyValue()
  ref.current = value

  return ref.current
}
```

lazyValue 函数在 react 应用生命周期内，只执行一次！后续获取 value 总是指向源对象。
