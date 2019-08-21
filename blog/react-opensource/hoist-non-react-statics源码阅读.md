> version 3.3.0

这个包意思是重写一个 Object.assgin 专门用于 React Component，在拷贝的过程中能够滤去 React Component 内置的静态属性。只拷贝用户定义的属性。

1. React ClassComponent 上的静态属性

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

2. 已知的 JS Object & Function 对象内置属性

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

3. FORWARD_REF Component 上的属性

```ts
const FORWARD_REF_STATICS = {
  $$typeof: true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
}
```

4. MEMO Component 上的属性

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

5. 获取 React Component 对应的静态属性名集合

```ts
// getStatics: component => Object
function getStatics(component) {
  if (isMemo(component)) {
    return MEMO_STATICS
  }
  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS
}
```

### hoistNonReactStatics

将 sourceComponent 及其父类上的属性拷贝到 targetComponent 上。

> 过滤 JS 对象内置属性，过滤 React Component 内置静态属性

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
