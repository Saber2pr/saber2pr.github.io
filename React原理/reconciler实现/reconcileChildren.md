## children 新旧比对

拿到当前 fiber 对应 VNode 树的 children 集合作为新链表，通过 alternate 拿到旧链表，然后 diff 两条链表。

### 函数声明

```typescript
function reconcileChildren(fiber: Fiber, newChildren: Fiber | Fiber[]): Fiber;
```

第二个参数 newChildren 来源：当 fiber 为 host Fiber 类型时，则从 props.children 中取(由 jsxFactory 函数即 React.createElement 函数收集 children VNode)；当 fiber 为 hook Fiber 类型时(此时 fiber.tag 为 function 类型，也就是你的函数组件)，执行 fiber.tag(fiber.props)，即将 props 传入函数组件执行，返回 children。

### 函数实现

```typescript
function reconcileChildren(fiber: Fiber, newChildren: Fiber | Fiber[]) {
  // 数组化，归一化处理。例如'a' -> ['a'], ['a', 'b'] -> ['a', 'b']
  const children = React.Children.toArray<Fiber>(newChildren);

  // 拿到旧fiber节点的child
  let nextOldFiber = fiber.alternate ? fiber.alternate.child : null;

  let newFiber: Fiber = null;
  let i = 0;

  // 新旧两条链表开始比对，一条是VNode.props.children链表，一条是oldFiber.sibling链表
  while (i < children.length || nextOldFiber) {
    // prevChild用来记录上一次的newFiber，用于链接新的sibling-sibling链表
    const prevChild = newFiber;

    // 遍历过程中当前旧的节点
    const oldFiber = nextOldFiber;

    // 当前新的VNode节点
    const element = i < children.length && children[i];

    // 如果oldFiber存在且element也存在，并且两者tag相同，则两个fiber节点相同
    // 否则不同
    const sameTag = oldFiber && element && element.tag === oldFiber.tag;

    if (sameTag) {
      // 如果新旧节点相同，则直接拷贝旧的节点，并标记effectType为update
      // 为什么要拷贝，而不是直接newFiber = oldFiber，下文解释

      newFiber = new Fiber(oldFiber.type);
      newFiber.tag = oldFiber.tag;
      newFiber.instance = oldFiber.instance;
      newFiber.state = oldFiber.state;
      newFiber.props = element.props;
      newFiber.parent = fiber;
      newFiber.alternate = oldFiber; // 新fiber上利用alternate链接到旧的fiber，后续commit:update需要
      newFiber.effectType = "update";
      newFiber.effects = oldFiber.effects;
      newFiber.isMount = oldFiber.isMount;
    }
    if (element && !sameTag) {
      // 如果新的节点存在，但和旧的节点不同，则保持新节点的属性，并标记effectType为place

      newFiber = new Fiber(typeof element.tag === "string" ? "host" : "hook");
      newFiber.tag = element.tag;
      newFiber.props = element.props;
      newFiber.parent = fiber;
      newFiber.effectType = "place";
      newFiber.isMount = false; // 要被替换掉，所以UnMount
    }
    if (oldFiber && !sameTag) {
      // 如果旧的节点存在，但和新的节点不同，则删除旧的节点，并标记effectType为delete

      oldFiber.effectType = "delete";
      oldFiber.isMount = false; // 要被删除掉，所以UnMount
      // 提交到parent Fiber effectList中
      fiber.effectList.push(oldFiber);
      // 节点被删除，在父节点上标记refChild
      fiber.refChild = oldFiber.sibling;
    }

    // 旧链表向后遍历
    if (nextOldFiber) nextOldFiber = nextOldFiber.sibling;

    if (i === 0) {
      // 如果是第一个child则赋给parentFiber.child
      fiber.child = newFiber;
    } else if (prevChild && element) {
      // 链接新链表的sibling-sibling
      prevChild.sibling = newFiber;
    }

    // 新链表向后遍历，element依靠index索引从children获取current节点
    i++;
  }

  // 返回第一个child
  return fiber.child;
}
```

解释当 effectType 为 update 时为什么要拷贝:
一个词 immutable.
