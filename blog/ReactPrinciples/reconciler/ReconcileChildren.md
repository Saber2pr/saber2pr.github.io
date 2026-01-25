## Children comparison between new and old
Take the children collection of the current fiber corresponding VNode tree as the new linked list, get the old linked list through alternate, and then diff the two linked lists.
### Function declaration
```typescript
function reconcileChildren(fiber: Fiber, newChildren: Fiber | Fiber[]): Fiber;
```
The second parameter newChildren source: when fiber is the host Fiber type, it is taken from props.children (the jsxFactory function collects children VNode by the React.createElement function); when fiber is the hook Fiber type (when fiber.tag is the function type, that is, your function component), execute fiber.tag (fiber.props), that is, props is passed into the function component to execute and return children.
### Function realization
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
Explain why to copy when effectType is update:
One word immutable.