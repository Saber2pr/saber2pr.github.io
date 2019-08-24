## commit 阶段

检测到 pendingCommit 被赋值后则立刻进入 commit 阶段

### 函数声明

```typescript
function commitAllWork(fiber: Fiber): void;
```

传入 pendingCommit(一个 EffectFibers 链表，其实是 rootFiber，rootFiber 的 effectList 属性就相当于一个 Fiber 链表。JS 里数组不也是一种链表么，还是可迭代对象(Iteratable)呢)

### 函数实现

```typescript
function commitAllWork(fiber: Fiber) {
  // 遍历effectList链表，对每个EffectFiber执行commitWork操作
  fiber.effectList.forEach(commitWork);

  // 所有任务commit完毕后，将workInProgress和pendingCommit置空
  workInProgress = null;
  pendingCommit = null;
}
```
