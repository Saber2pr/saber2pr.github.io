### React event mechanism
1. In React, the event bubbling mechanism is independent of DOM event flow. In other words, the direction of the bubbling flow of React components depends only on the structure of the React component tree, not on the real DOM structure.
two。 An api for createPortal is provided in ReactDOM. You can render a React component under a specified DOM node. For example:
```tsx
<Parent>
  {ReactDOM.createPortal(<Test />, document.getElementById("root2"))}
</Parent>
```
This renders the Test component under the # root2 node. But the parent node of the Test component is the Parent component (although it is not in the real DOM).
Events from the Test component bubble up to the Parent component. But in a real DOM tree, Parent is not the Test parent. (point 1 is confirmed)
### Difference between ReactDOM.createPortal and ReactDOM.render
In terms of api parameters, the two are the same:
```tsx
ReactDOM.createPortal(<Test />, document.getElementById("root2"))

ReactDOM.render(<Test />, document.getElementById("root2"))
```
ReactDOM.render renders the React component under the specified DOM node. So is ReactDOM.createPortal.
So what's the difference? Analyze it from the point of view of source code:
1. ReactDOM.createPortal
```ts
function createPortal(
  children: ReactNodeList,
  containerInfo: DOMContainer,
  key?: string = null
): ReactNode {
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : "" + key,
    children,
    containerInfo
  }
}
```
So createPortal just creates an instance of ReactNode. There is no rendering logic.
2. ReactDOM.render (simplified)
```ts
const ReactDOM = {
  render(element: React$Element<any>, container: DOMContainer) {
    // _reactRootContainer是在真实DOM树根节点记录的Fiber树根节点
    let root: _ReactSyncRoot = container._reactRootContainer
    let fiberRoot
    if (!root) {
      // 首次渲染
      root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
        container,
        false
      )
      fiberRoot = root._internalRoot
      // 批量更新
      unbatchedUpdates(() => updateContainer(children, fiberRoot, null))
    } else {
      // _internalRoot是每个真实DOM实例上都有的属性，用于关联到DOM对应Fiber
      // 为了实现ReactDOM.render(非根组件)，即局部更新
      fiberRoot = root._internalRoot
      updateContainer(children, fiberRoot, null)
    }
  }
}
```
ReactDOM.render does not return a value and starts the rendering process.
> ReactDOM.render actually has a return value, such as component type or HTMLElement type, but it has been deprecated.