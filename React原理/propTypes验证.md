propTypes 只是单纯验证参数，而且没有未捕获的异常抛出。所以不管验证成功与否，props 都会传入组件，但会提示警告。

1. beginWork

[ReactFiberBeginWork.js#L706](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberBeginWork.js#L706)

```ts
function updateClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps,
  renderExpirationTime: ExpirationTime
) {
  if (__DEV__) {
    if (workInProgress.type !== workInProgress.elementType) {
      const innerPropTypes = Component.propTypes
      if (innerPropTypes) {
        checkPropTypes(
          innerPropTypes,
          nextProps, // Resolved props
          "prop",
          getComponentName(Component),
          getCurrentFiberStackInDev
        )
      }
    }
  }
  ...
}
```

2. checkPropTypes 方法来自 prop-types 库，内部异常被捕获并序列化打印出警告

[checkPropTypes.js#L64](https://github.com/facebook/prop-types/blob/master/checkPropTypes.js#L64)

```ts
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== "production") {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error
        try {
          if (typeof typeSpecs[typeSpecName] !== "function") {
            var err = Error("...TypeError...")
            err.name = "Invariant Violation"
            throw err
          }
          error = typeSpecs[typeSpecName](
            values,
            typeSpecName,
            componentName,
            location,
            null,
            ReactPropTypesSecret
          )
        } catch (ex) {
          error = ex
        }
        if (error && !(error instanceof Error)) {
          printWarning(error)
        }
      }
    }
  }
}
```

而且为了性能，prop-types 验证只在 dev mode 进行。生产环境上将不做任何处理。
