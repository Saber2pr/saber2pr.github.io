### Error handling in React
1. Unified capture in workLoop Big Loop
```js
try {
  workLoop()
} catch (error) {
  handleError(error)
}

function handleError(error) {
  throwException(error)
}
```
Source location
Https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberWorkLoop.js#L692
ThrowException is called in handleError, so it mainly depends on the throwException implementation: (simplified, only class and host components are shown)
```js
function throwException(fiber, errorInfo) {
  let workInProgress = fiber
  while (workInProgress) {
    switch (workInProgress.tag) {
      case HostRoot: {
        createRootErrorUpdate(workInProgress, errorInfo)
        return
      }
      case ClassComponent:
        const ctor = workInProgress.type
        const instance = workInProgress.stateNode
        if (
          typeof ctor.getDerivedStateFromError === "function" ||
          typeof instance.componentDidCatch === "function"
        ) {
          createClassErrorUpdate(workInProgress, errorInfo)
        }
        break
    }
    workInProgress = workInProgress.return
  }
}
```
The principle is to use the fiber.return linked list to find out whether the parent class component implements the componentDidCatch method.
The logError method is called internally in createClassErrorUpdate to print the component tree, which is still fiber.return up and collects the displayName of the component.
About the hook component is to find the parent Suspense fallback for error rollback.