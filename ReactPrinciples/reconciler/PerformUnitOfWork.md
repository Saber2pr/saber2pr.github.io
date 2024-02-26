## Function declaration
```typescript
function performUnitOfWork(fiber: Fiber): void;
```
Traverse a Fiber list, reconstruct and collect effectFibers(merge upward and finally collect them into effectLists of head Fiber(i.e. rootFiber) of Fiber list)
## Function realization
```typescript
function performUnitOfWork(fiber: Fiber) {
  // beginWork内部负责对fiber.child的两条sibling-sibling链表进行新旧比对
  // 通过child.alternate拿到旧的链表
  // 最终返回fiber.child
  const next = beginWork(fiber);
  // 如果next(也就是fiber.child)存在，则直接返回它
  if (next) return next;

  // 如果不存在，则开始回溯
  let current = fiber;
  while (current) {
    // completeWork负责向上收集effectFibers，如果到达了顶点，则把当前Fiber节点赋值给pendingCommit
    completeWork(current);

    // 如果有sibling，则返回它的sibling
    if (current.sibling) return current.sibling;
    // 如果没有sibling，则向上回溯
    current = current.parent;
  }
}
```