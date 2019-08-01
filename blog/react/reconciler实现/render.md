## ReactDOM.render

渲染流程起点

### 函数声明

```typescript
export namespace ReactDOM {
  export function render(component: JSX.Element): void;
  export function render(component: JSX.Element, container: HTMLElement): void;
}
```

函数重载两次

传入 container 参数(也就是 div#root)，表示这是第一次渲染，并清空 rootContainer 子节点。创建一个 host Fiber(rootFiber)，其实例为 container，将 component 添加到 rootFiber 的子节点(即保存到 rootFiber.props 的 children 属性 )。

不传 container 参数表示是一次由 hook 函数组件调用 ReactDispatcher 引起的更新(场景为用户点击事件)，例如 useState 返回的 setState 函数执行，在 createWorkInProgress 函数中将从当前 fiber 实例上的 stateNode 向上回溯到 rootFiber 并赋值给 workInProgress。

### 函数实现

```typescript
export namespace ReactDOM {
  export function render(
    component: JSX.Element,
    container?: HTMLElement
  ): void {
    let fiber: Fiber;

    if (container) {
      // 第一次渲染

      // 创建一个rootFiber
      fiber = new Fiber("host");

      // rootFiber实例为真实DOM(div#root)
      fiber.instance = container as FiberInstance;

      // 清空rootFiber实例子节点
      container.innerHTML = null;

      // 将component添加到 rootFiber 的子节点
      fiber.props = { children: component };
    } else {
      // 创建一个hook Fiber
      fiber = new Fiber("hook");

      // 将函数组件作为hook Fiber的实例
      fiber.instance = component as FiberInstance;

      // 设置高优先级
      fiber.expirationTime = 1;
    }

    // 放入待调度队列
    updateQueue.push(fiber);

    // 启动渲染流程
    requestIdleCallback(performWork);
  }
}
```
