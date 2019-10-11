## Fiber 链表

> 数据域和 React Fiber 有所区别，但核心的指针域是一样的。

### 概览

```typescript
type Fiber = {
  type: FiberType
  tag: Tag | React.FC
  effectType: EffectType
  parent: Fiber
  child: Fiber
  sibling: Fiber
  alternate: Fiber
  props: Props
  state: Dict
  memorize: Dict
  effects: Effect[]
  effectList: Fiber[]
  instance: FiberInstance
  stateNode: Fiber
  expirationTime: number
  isMount: boolean = false
  refChild: Fiber
}
```

### Fiber.type

```typescript
type FiberType = "host" | "hook"
```

如果一个 Fiber 的 type 值为 "host"，那么表示它的实例(Fiber.instance)是原生 DOM 节点。
如果值为"hook"，那么表示它的实例是函数组件(React.FC)对应的 Fiber，也就是自己，此时 Fiber.tag 是函数组件(function)。

### Fiber.tag

```typescript
type Fiber = {
  tag: Tag | React.FC
}

// Dict 字典类型
type Dict = { [k: string]: any }

namespace React {
  // FC 函数组件类型
  export type FC<T extends Dict = Dict> = (props: T) => JSX.Element
}

type Tag = keyof HTMLElementTagNameMap | "text"
```

Fiber.tag 的类型可以是 string 类型，也可以是 function 类型。string 类型就是原生 DOM 节点的 TagNameMap 集合成员，这里在集合中添加了一个新的 tag: "text"，用于表示原生 Text 对象，即文本节点。

当 tag 为 string 类型时，Fiber.instance 就是 DOM 实例，为 function 类型时，Fiber.instance 就是函数组件对应的 Fiber

### Fiber.effectType

```typescript
type EffectType = "place" | "delete" | "update"
```

effectType 有三种类型，替换，删除，更新。

其实还有创建，但是其过程和 place 相似(从无到有不也是一种替换么？)，故只要在 reconcile 阶段 和 commit 阶段 处理中稍作判断即可当作 place 处理。

### Fiber 指针域(parent, child, sibling)

```typescript
type Fiber = {
  parent: Fiber
  child: Fiber
  sibling: Fiber
}
```

Fiber 链表的空间结构

![loading](https://saber2pr.top/MyWeb/resource/image/fiber-tree.webp)

```typescript
parent
|    \
child-sibling
|
child
```

和 TreeNode 数据结构有所不同，Fiber 添加了一个称做 sibling 的指针域，指向自己的兄弟节点。在 TreeNode 的遍历中可以直接拿到 children 集合，然后使用栈或者队列进行深度优先或者广度优先遍历。而在 Fiber 节点中，采取的是深度优先 + 回溯的办法遍历，优先向下遍历 child-child 链表，到头之后优先回溯到 sibling，再向下遍历 child-child 链表，如果没有 sibling 就回溯到 parent，如果没有 parent 就遍历终止。

### Fiber.alternate

```typescript
type Fiber = {
  alternate: Fiber
}
```

alternate 用于链接到旧的自己。

在 reconcileChildrenArray 阶段中判断 tag 是否相同，相同则标记 effectType:'update'，tag 不同或者旧的自己为 null 则标记 effectType:'place'，并把旧的自己标记 effectType:'delete'然后提交到 parent 的 effectList 中。

在 commit 阶段的 effectType:update 处理中，利用 alternate 链接到旧的自己并与之 diff props 判断，更新变化的属性到真实 DOM。

### Fiber.props

```typescript
type Dict = { [k: string]: any }

interface Props extends Dict {
  children?: Fiber | Fiber[]
  ref?: React.RefAttributes<any>
}
```

如果 Fiber.type 值为'host'， 那么 props 表示真实 DOM 数据域，用于描述 DOM 属性。在 commit effectType:'update' 阶段参与属性 diff。

如果 Fiber.type 值为'hook'，则 props 用于函数组件传值，例如传递 children。在 updateHookComponent 阶段中将 props 传入函数组件实例并执行，得到新的 elements(VDom tree 的所有孩子节点) 用于 reconcileChildrenArray。

### Fiber.state

```typescript
type Fiber = {
  state: Dict
}
```

Fiber 函数组件状态。在 useState Hook 中读取和更新。

### Fiber.memorize

```typescript
type Fiber = {
  memorize: Dict
}
```

记录 memo hook 上次的输入。

### Fiber.effects

```typescript
type Effect = (...args: any) => Effect | void

type Fiber = {
  effects: Effect[]
}
```

Fiber 函数组件中的副作用操作，在该 Fiber 最终的 commit 阶段执行。
如果 effect 执行后返回了新的函数，则保存新的函数到 effects 中，在 commit effectType:'place'阶段和 commit effectType:'delete'执行。

使用 Fiber.isMount 来确定副作用是否需要 commit，如果组件已经 Mount，则保持 effects。

> Effect 是一个自函子类型，将自身映射为自身类型，其实应该算是 Monad 了。其实函数本身就是个 Monad，函数本身就实现了 return (高阶化) 和>>= (函数执行降阶)。

### Fiber.effectList

```typescript
type Fiber = {
  effectList: Fiber[]
}
```

用于向上收集打上 effectType 标记的 Fiber 节点，最终收集到 rootFiber。在 commit 阶段遍历 effectList 中所有 Fiber。

### Fiber.instance

```typescript
type FiberInstance = Fiber & HTMLElement

type Fiber = {
  instance: FiberInstance
}
```

Fiber 实例，当 Fiber.type 值为'host'时，instance 就是真实 DOM，值为'hook'时，instance 就是函数组件对应 Fiber(自己)。

### Fiber.stateNode

```typescript
type Fiber = {
  stateNode: Fiber
}
```

在 rootFiber 实例(rootContainer 也就是 div#root 节点) 上链接到 rootFiber。

### Fiber.expirationTime

```typescript
type Fiber = {
  expirationTime: number
}
```

Fiber 完成一次 reconcile 所需要的最少时间。

### Fiber.isMount

```typescript
type Fiber = {
  isMount: boolean
}
```

标记 Fiber Mount 状态

### Fiber.refChild

```typescript
type Fiber = {
  refChild: Fiber
}
```

当 Fiber.effectType 为'delete'时将自己的 sibling 标记到 parent 的 refChild 属性，用于 commit effectType:'place'阶段的 insertBefore。
在 commit effectType:'place'阶段会判断 parent 上的 refChild 属性是否为空，如果为空则表示 create 操作(append)，如果不为空则表示 place 操作(insertBefore)。
