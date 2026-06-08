### Compose
Functional programming is a favorite combination function. Let's take a look at how the redux author implements it.
```ts
export default function compose(...funcs) {
  if (funcs.length === 0) return arg => arg
  if (funcs.length === 1) return funcs[0]
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
Of course, it can also be realized as
```ts
export function compose(...fns: Array<(...value: any) => any>) {
  return (value: any) => fns.reverse().reduce((a, b) => b(a), value)
}
```
The difference is whether to allow funcs [0] multiple parameters. Because the premise of compose is the function after curry.
The compose implemented by TS above is very bad. It's all any.
If you have seen the d.ts file of a function library such as redux or rambda, you may feel desperate.
The type of compose is like this
> gh energy ahead
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
I'm sure you have no incentive to figure it out.
But I'll write an example, and you should be able to find out why it looks like this.
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