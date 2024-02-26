## Memo Hook
Memorize optimization
Because for pure functions, the same input gets the same output, the result can be cached, and there is no need to do it again for the same input.
### The diff of the deps array
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
There's nothing to explain.
## UseMemo implementation
Depend on the Fiber.memorize attribute
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