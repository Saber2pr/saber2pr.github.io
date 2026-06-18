Ref Hook stores values that do not change throughout the life of the React app. In the alternation of the old and new workInProgress, ref is passed as an object, and object passing does not copy. So this makes it easy to implement the singleton pattern and store singleton instances with ref. Singleton mode can achieve similar memorize effect, for example, need to keep a state alive, keep it alive, avoid repeated operations, repeated requests, etc., you can use singleton mode, initialize once, subsequent access is always the first created object, that is, keep the reference of the object. In React components, the singleton pattern is very important, because for each component is a function, if not optimized, it will cause a lot of repeated operations, and the state is not continuous every time it is reinitialized (no context), so Ref Hook has a very important role in keeping live. It is worth mentioning that the relationship between Ref Hook and State Hook, Ref Hook is implemented using State Hook, but the state type is {current:any}, and the state of both is stored in fiber.memoizedState. So the State Hook also has context.
For example, implement a singleton Hook:
```ts
const useSingleton = async <T>(lazyValue: () => Promise<T>) => {
  const ref = useRef<T>()
  if (ref.current) return ref.current

  const value = await lazyValue()
  ref.current = value

  return ref.current
}
```
The lazyValue function is executed only once during the life cycle of the react application! The subsequent acquisition of value always points to the source object.