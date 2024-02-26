> version 3.3.0
This package means to rewrite an Object.assgin specifically for React Component, which can filter out the static properties built into React Component during the copy process. Only user-defined attributes are copied.
1. Static properties on React ClassComponent
```ts
const REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
}
```
two。 Known built-in properties of JS Object & Function objects
```ts
const KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
}
```
3. Properties on FORWARD_REF Component
```ts
const FORWARD_REF_STATICS = {
  $$typeof: true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
}
```
4. Properties on MEMO Component
```ts
const MEMO_STATICS = {
  $$typeof: true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
}

const TYPE_STATICS = {}
TYPE_STATICS[ForwardRef] = FORWARD_REF_STATICS
```
5. Gets the collection of static attribute names corresponding to React Component
```ts
// getStatics: component => Object
function getStatics(component) {
  if (isMemo(component)) {
    return MEMO_STATICS
  }
  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS
}
```
### HoistNonReactStatics
Copy attributes from sourceComponent and its parent class to targetComponent.
> ltering JS object built-in properties, filtering React Component built-in static properties
```ts
export default function hoistNonReactStatics(
  targetComponent,
  sourceComponent,
  blacklist
) {
  if (typeof sourceComponent !== 'string') {
    // 顺着sourceComponent的原型链将sourceComponent父类的属性也拷贝到targetComponent上
    // 因为是从class上面找，如果是class实例就不用访问原型链了
    if (objectPrototype) {
      const inheritedComponent = getPrototypeOf(sourceComponent)
      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist)
      }
    }

    // keys中存入被assgin组件的属性名集合
    let keys = getOwnPropertyNames(sourceComponent)

    // keys中存入被assgin组件上的symbol集合
    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent))
    }

    // 获取Component对应的属性名集合
    const targetStatics = getStatics(targetComponent)
    const sourceStatics = getStatics(sourceComponent)

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]
      if (
        // 过滤掉JS内置属性名
        !KNOWN_STATICS[key] &&
        // 过滤掉被黑名单的属性名
        !(blacklist && blacklist[key]) &&
        // 过滤掉sourceComponent上有的React Component内置静态属性名
        !(sourceStatics && sourceStatics[key]) &&
        // 过滤掉targetComponent上有的React Component内置静态属性名
        !(targetStatics && targetStatics[key])
      ) {
        const descriptor = getOwnPropertyDescriptor(sourceComponent, key)
        try {
          defineProperty(targetComponent, key, descriptor)
        } catch (e) {}
      } // 完成属性拷贝
    }
  }

  return targetComponent
}
```