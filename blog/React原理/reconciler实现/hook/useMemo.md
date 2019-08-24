## Memo Hook

memorize 优化

因为对于纯函数来说，相同的输入得到相同的输出，所以可以把结果缓存起来，对于同样的输入没必要再执行第二遍。

### 对 deps 数组的 diff

```typescript
const diffArray = <T extends any[]>(a: T, b: T) => {
  if (a.length && b.length) {
    let i = a.length > b.length ? a.length : b.length;
    while (i--) if (a[i] !== b[i]) return false;
    return true;
  } else {
    return false;
  }
};
```

没什么好解释的。

## useMemo 实现

依赖 Fiber.memorize 属性

```typescript
// memo hook的顺序id分配器
const MemoOrder = Order.create();

export function useMemo(callback: Function, deps: any[] = []) {
  // 给当前hook关联的memorize分配一个id
  const id = MemoOrder.forward();

  // currentFiber是一个不断变化的值，hook内部需要捕获并缓存一份它的瞬时值
  // 记录即缓存一份currentFiber，拿到控制权，用于从当前记录点恢复
  const fiber = currentFiber;

  // fiber.memorize是一个memorizations map，类型为 {[id:string]: Dict}
  const memoMap = fiber.memorize;

  // 获取上一次输入
  const memorized = memoMap[id] || [];

  if (diffArray(deps, memorized)) {
  } else {
    // 如果和上次输入不同，则更新memorization为新的deps
    memoMap[id] = deps;
    // 执行memo callback
    callback();
  }
}
```
