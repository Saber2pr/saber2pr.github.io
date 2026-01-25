## Commit stage
When pendingCommit is detected, it immediately enters the commit phase.
### Function declaration
```typescript
function commitAllWork(fiber: Fiber): void;
```
Pass in pendingCommit (an EffectFibers linked list, which is actually the effectList property of rootFiber,rootFiber is equivalent to a Fiber linked list. Isn't JS array a kind of linked list, or is it an iterable object (Iteratable)?
### Function realization
```typescript
function commitAllWork(fiber: Fiber) {
  // 遍历effectList链表，对每个EffectFiber执行commitWork操作
  fiber.effectList.forEach(commitWork);

  // 所有任务commit完毕后，将workInProgress和pendingCommit置空
  workInProgress = null;
  pendingCommit = null;
}
```