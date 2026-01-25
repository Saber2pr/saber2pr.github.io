## Fiber linked list
> the data domain is different from React Fiber, but the core pointer domain is the same.
### Overview
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
If the type value of a Fiber is "host", then its Fiber.instance is a native DOM node.
If the value is "hook", then its instance is the Fiber corresponding to the function component (React.FC), that is, itself, where Fiber.tag is the function component (function).
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
The type of Fiber.tag can be either string or function. The string type is the TagNameMap collection member of the native DOM node, and a new tag, "text", is added to the collection to represent the native Text object, that is, the text node.
When tag is of type string, Fiber.instance is the instance of DOM, and when it is of type function, Fiber.instance is the Fiber corresponding to the function component.
### Fiber.effectType
```typescript
type EffectType = "place" | "delete" | "update"
```
There are three types of effectType, replace, delete, and update.
In fact, there is also creation, but its process is similar to place (isn't it also a kind of substitution from nothing?), Therefore, as long as the reconciliation phase and commit phase of processing a little judgment can be treated as a place.
### Fiber pointer domain (parent, child, sibling)
```typescript
type Fiber = {
  parent: Fiber
  child: Fiber
  sibling: Fiber
}
```
Spatial Structure of Fiber Linked List
![loading](https://saber2pr.top/MyWeb/resource/image/fiber-tree.webp)
```typescript
parent
|    \
child-sibling
|
child
```
Unlike the TreeNode data structure, Fiber adds a pointer field called sibling, pointing to its sibling node. In the traversal of TreeNode, you can get the children collection directly, and then use the stack or queue for depth-first or breadth-first traversal. In the Fiber node, the method of depth first + backtracking is adopted, traversing the child-child linked list first, then traversing the child-child linked list first after the end, then traversing the child-child linked list down, if there is no sibling, then going back to parent, if there is no parent, the traversal is terminated.
### Fiber.alternate
```typescript
type Fiber = {
  alternate: Fiber
}
```
Alternate is used to link to the old self.
In the reconcileChildrenArray stage, determine whether the tag is the same, mark the effectType:'update',tag is different or the old self is null, mark effectType:'place', and then submit the old self tag effectType:'delete' to the effectList of parent.
In the effectType:update processing of the commit phase, we use alternate to link to the old self and diff props to judge with it, and update the changed attributes to the real DOM.
### Fiber.props
```typescript
type Dict = { [k: string]: any }

interface Props extends Dict {
  children?: Fiber | Fiber[]
  ref?: React.RefAttributes<any>
}
```
If the Fiber.type value is' host', then props represents the real DOM data field and is used to describe the DOM attribute. Participate in the attribute diff during the commit effectType:'update' phase.
If the Fiber.type value is' hook', then props is used for function components to pass values, such as passing children. In the updateHookComponent phase, props is passed into the function component instance and executed to get a new elements (all child nodes of VDom tree) for reconcileChildrenArray.
### Fiber.state
```typescript
type Fiber = {
  state: Dict
}
```
Fiber function component state. Read and update in useState Hook.
### Fiber.memorize
```typescript
type Fiber = {
  memorize: Dict
}
```
Record the last input from memo hook.
### Fiber.effects
```typescript
type Effect = (...args: any) => Effect | void

type Fiber = {
  effects: Effect[]
}
```
Side effects in the Fiber function component are performed in the final commit phase of the Fiber.
If a new function is returned after effect execution, the new function is saved to effects and executed during the commit effectType:'place' phase and commit effectType:'delete'.
Use Fiber.isMount to determine if side effects require commit, and if the component is already Mount, keep effects.
> Effect is a self-function type, which maps itself to its own type, which should actually be regarded as Monad. In fact, the function itself is a Monad, and the function itself implements return (higher order) and > > = (function execution reduction).
### Fiber.effectList
```typescript
type Fiber = {
  effectList: Fiber[]
}
```
It is used to collect the Fiber nodes marked with effectType up, and finally collect the rootFiber. Iterate through all the Fiber in the effectList during the commit phase.
### Fiber.instance
```typescript
type FiberInstance = Fiber & HTMLElement

type Fiber = {
  instance: FiberInstance
}
```
For Fiber instance, when the Fiber.type value is' host', instance is the real DOM, and when the value is' hook', instance is the Fiber corresponding to the function component (itself).
### Fiber.stateNode
```typescript
type Fiber = {
  stateNode: Fiber
}
```
Link to rootFiber on the rootFiber instance (rootContainer, that is, the div#root node).
### Fiber.expirationTime
```typescript
type Fiber = {
  expirationTime: number
}
```
The minimum time it takes for Fiber to complete a reconcile.
### Fiber.isMount
```typescript
type Fiber = {
  isMount: boolean
}
```
Mark Fiber Mount statu
### Fiber.refChild
```typescript
type Fiber = {
  refChild: Fiber
}
```
When Fiber.effectType is 'delete', mark its own sibling to the refChild attribute of parent for insertBefore at commit effectType:'place'stage.
During the commit effectType:'place' phase, it is determined whether the refChild attribute on parent is empty, which indicates a create operation (append) and a place operation (insertBefore) if it is not empty.