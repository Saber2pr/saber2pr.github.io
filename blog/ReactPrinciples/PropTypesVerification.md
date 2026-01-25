PropTypes simply validates parameters and does not throw uncaught exceptions. So regardless of whether the validation is successful or not, the props passes in the component, but prompts a warning.
1. BeginWork
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
2. checkPropTypes method from prop-types library, inner exception caught and serialized to print out warning
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
And for the sake of performance, prop-types validation is done only in dev mode. No processing will be done in the production environment.