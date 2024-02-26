## PerformWork rendering process
Render rendering process entry
### Function declaration
```typescript
function performWork(deadline: IdleDeadline);
```
PerformWork is registered to the background collaborative task queue by the requestIdleCallback function, and the functions in the queue are executed when the JS thread is idle.
### Function realization
```typescript
function performWork(deadline: IdleDeadline) {
  // 内部循环迭代workInProgress
  workLoop(deadline);

  // 如果workInProgress为空了，表示当前渲染任务执行完毕，查看updateQueue是否为空
  // 如果不为空则再请求一次后台协同任务
  if (workInProgress || updateQueue.length) {
    requestIdleCallback(performWork);
  }
}
```