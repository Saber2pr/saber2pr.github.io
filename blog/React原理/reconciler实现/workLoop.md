## workLoop 渲染循环

用于创建并迭代更新 workInProgress(一个 Fiber 链表)。同时负责检查 pendingCommit(就是收集了 effectFibers 的 rootFiber，也可以实现为一个 Fiber 链表)，如果有就进入 commit 阶段。

### 函数声明

```typescript
function workLoop(deadline: IdleDeadline);
```

传入了一个 deadline 对象，检查空闲时间。

### 函数实现

```typescript
function workLoop(deadline: IdleDeadline) {
  // 如果workInProgress为空，则先构建一个Fiber赋值给workInProgress
  // 本质是回溯到rootFiber
  if (!workInProgress) workInProgress = createWorkInProgress(updateQueue);

  // 如果workInProgress不为空且当前空闲时间足够就开始迭代更新。
  while (
    workInProgress &&
    deadline.timeRemaining() > workInProgress.expirationTime
  ) {
    // 迭代更新
    workInProgress = performUnitOfWork(workInProgress);
  }

  // 如果有pendingCommit则立刻commit
  if (pendingCommit) commitAllWork(pendingCommit);
}
```
