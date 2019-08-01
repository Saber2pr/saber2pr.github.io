## performWork 渲染流程

render 渲染流程入口

### 函数声明

```typescript
function performWork(deadline: IdleDeadline);
```

performWork 由 requestIdleCallback 函数注册到后台协同任务队列，当 JS 线程空闲时执行队列中的函数。

### 函数实现

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
