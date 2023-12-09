### compose

函数式编程喜闻乐见的组合函数。来看看redux作者是怎么实现它的。

```ts
export default function compose(...funcs) {
  if (funcs.length === 0) return arg => arg
  if (funcs.length === 1) return funcs[0]
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

当然也可以实现为

```ts
export function compose(...fns: Array<(...value: any) => any>) {
  return (value: any) => fns.reverse().reduce((a, b) => b(a), value)
}
```

区别就是 是否允许funcs[0]多参数。因为compose的前提是curry后的函数。

上面TS实现的compose非常糟糕。都是any。

如果你看过redux或是rambda等函数式库的d.ts文件，你可能会感到绝望。

compose的类型是这样的

> 前方高能

```ts
export function compose<T1>(fn0: () => T1): () => T1
export function compose<V0, T1>(fn0: (x0: V0) => T1): (x0: V0) => T1
export function compose<V0, V1, T1>(
  fn0: (x0: V0, x1: V1) => T1
): (x0: V0, x1: V1) => T1
export function compose<V0, V1, V2, T1>(
  fn0: (x0: V0, x1: V1, x2: V2) => T1
): (x0: V0, x1: V1, x2: V2) => T1

export function compose<T1, T2>(fn1: (x: T1) => T2, fn0: () => T1): () => T2
export function compose<V0, T1, T2>(
  fn1: (x: T1) => T2,
  fn0: (x0: V0) => T1
): (x0: V0) => T2
export function compose<V0, V1, T1, T2>(
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1) => T1
): (x0: V0, x1: V1) => T2
export function compose<V0, V1, V2, T1, T2>(
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1, x2: V2) => T1
): (x0: V0, x1: V1, x2: V2) => T2

export function compose<T1, T2, T3>(
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: () => T1
): () => T3
export function compose<V0, T1, T2, T3>(
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V0) => T1
): (x: V0) => T3
export function compose<V0, V1, T1, T2, T3>(
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1) => T1
): (x0: V0, x1: V1) => T3
export function compose<V0, V1, V2, T1, T2, T3>(
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1, x2: V2) => T1
): (x0: V0, x1: V1, x2: V2) => T3

export function compose<T1, T2, T3, T4>(
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: () => T1
): () => T4
export function compose<V0, T1, T2, T3, T4>(
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V0) => T1
): (x: V0) => T4
export function compose<V0, V1, T1, T2, T3, T4>(
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1) => T1
): (x0: V0, x1: V1) => T4
export function compose<V0, V1, V2, T1, T2, T3, T4>(
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1, x2: V2) => T1
): (x0: V0, x1: V1, x2: V2) => T4

export function compose<T1, T2, T3, T4, T5>(
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: () => T1
): () => T5
export function compose<V0, T1, T2, T3, T4, T5>(
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V0) => T1
): (x: V0) => T5
export function compose<V0, V1, T1, T2, T3, T4, T5>(
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1) => T1
): (x0: V0, x1: V1) => T5
export function compose<V0, V1, V2, T1, T2, T3, T4, T5>(
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1, x2: V2) => T1
): (x0: V0, x1: V1, x2: V2) => T5

export function compose<T1, T2, T3, T4, T5, T6>(
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: () => T1
): () => T6
export function compose<V0, T1, T2, T3, T4, T5, T6>(
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V0) => T1
): (x: V0) => T6
export function compose<V0, V1, T1, T2, T3, T4, T5, T6>(
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1) => T1
): (x0: V0, x1: V1) => T6
export function compose<V0, V1, V2, T1, T2, T3, T4, T5, T6>(
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x0: V0, x1: V1, x2: V2) => T1
): (x0: V0, x1: V1, x2: V2) => T6
```

我相信你已经没有动力想要搞清楚它了。

不过我写一个例子，你应该能从中找到为什么会变成上面这个样子的原因。

```ts
// 二元运算compose
const compose: <A, R1, R2>(
  f2: (a: R1) => R2,
  f1: (a: A) => R1
) => (a: A) => R2 = (f2, f1) => a => f2(f1(a));

// 三元运算compose
const compose: <A, R1, R2, R3>(
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (a: A) => R1
) => (a: A) => R3 = (f3, f2, f1) => a => f3(f2(f1(a)));
```