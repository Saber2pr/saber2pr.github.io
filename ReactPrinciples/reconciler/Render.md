## ReactDOM.render
Starting point of the rendering process
### Function declaration
```typescript
export namespace ReactDOM {
  export function render(component: JSX.Element): void;
  export function render(component: JSX.Element, container: HTMLElement): void;
}
```
Function overloaded twice
Pass in the container parameter (i.e. div#root), indicating that this is the first rendering and clearing the rootContainer child node. Create a host Fiber(rootFiber) whose instance is container, and add the component to the child node of rootFiber (i.e. the children attribute saved to rootFiber.props).
Not passing the container parameter means that it is an update caused by the hook function component calling ReactDispatcher (the scenario is a user click event), such as the execution of the setState function returned by useState, in which the createWorkInProgress function traces back from the stateNode on the current fiber instance to rootFiber and assigns a value to workInProgress.
### Function realization
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