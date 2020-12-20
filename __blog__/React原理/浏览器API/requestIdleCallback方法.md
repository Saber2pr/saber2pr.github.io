## 简介

这个 API 是 BOM API 之一，即 window.requestIdleCallback，由浏览器实现。在 Node.js 上没有此 API 的实现。

它会在浏览器空闲时期调用注册的函数，即 JS 引擎的空闲时期。

函数签名(由于还处于提案阶段，Typescript 并没有给出函数的声明，所以需要自己 declare 声明函数的签名)

```typescript
declare interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number; // 时间片中剩余时间(0 <= timeRemained < 50)
}

declare type IdleOptions = {
  timeout: number;
};

declare type IdleCallback = (deadline: IdleDeadline) => void;

declare function requestIdleCallback(callback: IdleCallback): number;

declare function requestIdleCallback(
  callback: IdleCallback,
  options: IdleOptions
): number;
```

浏览器将时间以每 50ms 切成片，每个时间片内会执行 JS 线程。如果有空余时间，会执行 IdleCallback，并传入一个 deadline 对象，用于获取剩余空闲时间。

## Fiber 相关

此 API 对于 Fiber 调度算法的意义重大，通过判断算法复杂度和 timeRemained 的相对大小决定是否进行调度更新。

在 Fiber 调度逻辑中，requestIdleCallback 用于迭代更新 workInProgress

简化后的逻辑

```typescript
function workLoop(deadline: IdleDeadline) {
  nextWorkInProgress = performUnitOfWork(nextWorkInProgress);

  if (nextWorkInProgress) {
    requestIdleCallback(workLoop);
  }
}

// 开始调度循环
requestIdleCallback(workLoop);
```
