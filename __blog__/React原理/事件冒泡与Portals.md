### React 事件机制

1. 在 React 中，事件冒泡机制是独立于 DOM 事件流的。也就是说，React 组件冒泡流方向只取决于 React 组件树的结构，而与真实 DOM 结构无关。

2. 在 ReactDOM 中提供了一个 createPortal 的 api。可以将一个 React 组件渲染到指定的 DOM 节点下。例如：

```tsx
<Parent>
  {ReactDOM.createPortal(<Test />, document.getElementById("root2"))}
</Parent>
```

这将 Test 组件渲染到 #root2 节点下。但 Test 组件父节点是 Parent 组件（虽然在真实 DOM 中并不是）。

Test 组件的事件会冒泡到 Parent 组件。但在真实 DOM 树中，Parent 并不是 Test 父节点。(印证了第 1 点)

### ReactDOM.createPortal 与 ReactDOM.render 区别

从 api 参数上来看两者一样：

```tsx
ReactDOM.createPortal(<Test />, document.getElementById("root2"))

ReactDOM.render(<Test />, document.getElementById("root2"))
```

ReactDOM.render 将 React 组件渲染到指定 DOM 节点下。ReactDOM.createPortal 也是。

那么区别是什么？从源码角度进行分析：

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

所以 createPortal 只是创建了一个 ReactNode 实例。不会进行渲染逻辑。

2. ReactDOM.render(简化)

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

ReactDOM.render 没有返回值，而且会启动渲染流程。

> ReactDOM.render 其实是有返回值的，返回组件类型或 HTMLElement 类型，但己经 deprecated。
