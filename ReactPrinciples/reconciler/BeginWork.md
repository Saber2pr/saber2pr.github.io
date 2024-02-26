## Reconcile stage entry
Determine the type of the current fiber (host or hook). If it is a host type, a dom node is generated according to the fiber.tag. If it is a hook type, the instance is itself, and a stateNode attribute (or itself) is saved on the instance for backtracking to the rootFiber in the createWorkInProgress execution.
```typescript
function beginWork(fiber: Fiber) {
  if (fiber.type === "hook") {
    return updateHOOKComponent(fiber);
  } else {
    return updateHostComponent(fiber);
  }
}
```
### UpdateHostComponent
Update host Fiber
```typescript
function updateHostComponent(fiber: Fiber) {
  // 如果实例不存在，则生成一个真实DOM节点赋给instance
  if (!fiber.instance) fiber.instance = renderToDOM(fiber);
  // 对props.children(通过React.createElement生成的VNode树的children集合)进行reconcile新旧比对，标记effectType
  return reconcileChildren(fiber, fiber.props.children);
}
```
#### RenderToDOM
Generate corresponding instances based on host Fiber (real DOM)
```typescript
function renderToDOM(fiber: Fiber) {
  // 如果fiber.tag是function类型，则返回(这里主要用于类型安全)
  if (typeof fiber.tag === "function") return;

  // host Fiber实例可能是Element也可能是Text
  let dom: HTMLElement | Text = null;

  if (fiber.tag === "text") {
    // 如果tag 值为 text，则创建一个文本节点
    dom = document.createTextNode("");
  } else {
    // 根据fiber.tag创建对应真实DOM
    dom = document.createElement(fiber.tag);
  }

  // 根据fiber.props(即JSX标签上的属性)更新DOM节点
  // 第二个参数为oldProps，因为这是Fiber实例初始化，故没有alternate(旧的Fiber)。直接传一个空属性进去。
  updateHostProperties(dom, {}, fiber.props);

  return dom as FiberInstance;
}
```
### updateHOOKComponent
Update hook Fiber
```typescript
function updateHOOKComponent(fiber: Fiber) {
  // 如果实例不存在，则把函数组件对应Fiber(就是自己)赋给instance
  if (!fiber.instance) fiber.instance = fiber as FiberInstance;
  // 在实例上保存一个 stateNode 属性(还是自己)用于回溯到 rootFiber。
  fiber.instance.stateNode = fiber;

  // 给全局变量currentFiber赋值，在Hook API使用
  currentFiber = fiber.instance;

  // 用于hook API ID 分配，hook需要一个id来标识
  // 例如函数组件内多个useState Hook，在fiber.state上保存initialState时需要利用id区分
  // Order.fallback在hook组件执行后将id分配器回滚。(具体见后续实现)
  Order.fallback();

  // 这里判断fiber.tag是否为function类型，hook Fiber的实例是函数组件，所以tag就是函数组件。
  if (typeof fiber.tag !== "function") return;
  // 执行函数组件，并传入props对象，返回hook Fiber的 Vnode children
  return reconcileChildren(fiber, fiber.tag(fiber.props));
}
```