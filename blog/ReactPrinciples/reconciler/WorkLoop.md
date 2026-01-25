## WorkLoop rendering Loop
Used to create and iterate to update workInProgress (a Fiber linked list). At the same time, it is responsible for checking the pendingCommit (that is, the rootFiber that collects the effectFibers, which can also be implemented as a Fiber linked list), and if any, enter the commit phase.
### Function declaration
```typescript
function workLoop(deadline: IdleDeadline);
```
A deadline object is passed in to check for idle time.
### Function realization
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