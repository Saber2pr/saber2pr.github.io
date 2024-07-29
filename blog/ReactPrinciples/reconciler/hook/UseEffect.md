## Effect Hook
This is a pure operation, which wraps the side effects in Monad (it can be understood as wrapping another layer of functions). The react scheduling mechanism performs these side effects after a round of rendering, ensuring that the side effects are fully isolated from the main body of the function component.
### Effect Type
```typescript
type Effect = () => Effect | void;
```
This is a Monad implemented using functional features. First, it is a self-functor that maps to its own type, and then return can > > =, that is, a monoid in the category of self-functor.
## UseEffect implementation
```typescript
export function useEffect(effect: Effect, deps?: any[]) {
  if (deps) {
    // 如果deps存在，使用memorize优化
    useMemo(() => currentFiber.effects.push(effect), deps);
  } else {
    currentFiber.effects.push(effect);
  }
}
```
Here, the Moand is put into a List, and after the pure function component is executed (entering the commitWork phase), it is executed in turn.