## Ref Hook

ref 用来索引到 host Fiber 的实例(真实 DOM)

ref 是一个指针，在 JS 中实现为对象，传递它的引用避免值拷贝

### ref 类型

```typescript
type RefAttributes<T extends HTMLElement> = {
  current: T;
};
```

是一个对象，只有一个成员属性 current，泛型类型约束为 HTMLElement，即 T 类型需要满足 [继承自 HTMLElement] 的条件

### 何时被初始化？

在组件对应 Fiber commit 时初始化(异步初始化)，在组件内部需要异步读取此值，例如在 useEffect 里，在 onClick 里等等，组件内顶层直接读取值为 null(因为组件执行是同步的)

在实现 commitWork 的时候已经解释了 ref 的初始化。这里不再赘述。

## useRef 实现

因为它本质就是利用了 JS 中对象赋值传引用的特性。所以十分简单。

```typescript
export function useRef<T extends HTMLElement>(
  current: T = null
): React.RefAttributes<T> {
  return { current };
}
```

没有什么好解释的。

> 其实就是对 ref 惰性求值，你也可以把它实现为 pure 版本，利用 Monad 包装起来，例如 ref = () => current
