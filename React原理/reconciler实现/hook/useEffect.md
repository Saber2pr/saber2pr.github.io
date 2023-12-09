## Effect Hook

这是一个 pure 操作，将副作用包裹在了 Monad 里（可以理解为外面又包了一层函数），react 调度机制会在一轮渲染之后执行这些副作用操作，保证了副作用与函数组件主体的充分隔离。

### Effect 类型

```typescript
type Effect = () => Effect | void;
```

这是一个利用函数特性实现的 Monad。首先是个映射到自身类型的自函子，然后可以 return 可以 >>=，即自函子范畴上的幺半群。

## useEffect 实现

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

这里将 Moand 放到了一个 List 中，在纯函数组件执行完之后(进入 commitWork 阶段)，依次执行。
