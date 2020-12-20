## 单个 Fiber 的 commit 操作

### 函数声明

```typescript
function commitWork(fiber: Fiber): void;
```

根据 Fiber.effectType 的类型进行 commit 操作

### 函数实现

```typescript
function commitWork(fiber: Fiber) {
  // 向上查找host Fiber类型的parent节点
  let parentFiber = fiber.parent;
  while (parentFiber.type === "hook") {
    parentFiber = parentFiber.parent;
  }

  // 拿到host Fiber类型的parentFiber的实例(host Fiber类型的实例是真实DOM)
  const parentDom = parentFiber.instance;

  // 判断effectType
  if (fiber.effectType === "place" && fiber.type === "host") {
    // 如果是effectType:place，并且当前fiber是host Fiber类型

    // 因为组件要被其他组件替换，即UnMount，则执行effects中的清理函数。
    commitEffects(fiber);
    // place替换真实DOM节点(或append创建)
    commitPlace(fiber, parentDom, parentFiber.refChild);
  } else if (fiber.effectType === "update") {
    // 如果是effectType:update
    // diff 新旧fiber的props属性(利用alternate链接到旧的fiber的props)
    updateHostProperties(fiber.instance, fiber.alternate.props, fiber.props);
  } else if (fiber.effectType === "delete") {
    // 如果是effectType:delete
    // 组件卸载，执行effects中的清理函数
    commitEffects(fiber);
    // 删除真实DOM节点
    commitDelete(fiber, parentDom);
  }

  // 如果组件WillMount或者UnMount则执行一次commitEffects
  // 本质是遍历Fiber.effects数组，执行注册的副作用任务，并收集副作用的返回值(清理函数)。
  if (!fiber.isMount) commitEffects(fiber);

  // 如果props中注册了ref指针，并且当前fiber是host Fiber类型，则将实例(真实DOM)赋值给ref.current
  if ("ref" in fiber.props && fiber.type === "host") {
    fiber.props.ref.current = fiber.instance;
  }
}
```

#### commitPlace

替换或者创建 host Fiber 的实例

```typescript
function commitPlace(fiber: Fiber, parentDom: FiberInstance, refChild: Fiber) {
  if (refChild) {
    // 如果存在refChild表示是一次place操作
    const newChild = fiber.instance;
    // refChild就是fiber.alternate.sibling.instance，即旧fiber的兄弟节点
    const oldChild = refChild.instance;

    // 在旧fiber的兄弟节点前插入新fiber的实例
    parentDom.insertBefore(newChild, oldChild);
  } else {
    // 没有refChild，则是一次create操作
    // 组件WillMount，设置标志位true
    fiber.isMount = true;
    // 在DOM树上添加host Fiber实例
    parentDom.append(fiber.instance);
  }
}
```

#### commitDelete

删除 host Fiber 的实例(从 DOM 树上移除)

```typescript
function commitDelete(fiber: Fiber, parentDom: FiberInstance) {
  // 如果是hook Fiber，则找它的host Fiber子节点，但不能是text类型tag
  while (fiber.type === "hook") {
    if (fiber.child.tag === "text") break;
    fiber = fiber.child;
  }
  // 找到了hook Fiber的host Fiber子节点，将它的实例从DOM树上移除
  parentDom.removeChild(fiber.instance);
}
```
