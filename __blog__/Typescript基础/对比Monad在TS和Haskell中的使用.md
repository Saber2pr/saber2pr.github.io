因为在 TS 中没有关于 Monad 的类型，所以先实现基础设施。

> 只做简单实现，重点在于与 haskell 代码风格比较。
> 目的：加深对 Monad 的理解。

### Monad

Monad 中保存了一个值(惰性)。所以可以这样定义它

```typescript
type Monad<T> = {
  readonly _wrapped_: () => T;
};
```

wrapped 就是一个值包装器，将一个值惰性化。

> 意义: 用来保存值上下文，串联对值的一系列操作
> 处于相对于普通值类型的上层
> 在 haskell 中 Monad 为一个类型类

### return

也就是 pure。将一个值提升到 Monad。

```typescript
type pure = <T>(a: T) => Monad<T>;
const pure: <T>(a: T) => Monad<T> = value => ({
  _wrapped_: () => Object.freeze(value)
});
```

> 意义: 将一个值惰性化

### join

将一个 Monad 解包，然后应用一个提升函数，返回新的 Monad。

```typescript
type join = <A, B>(m: Monad<A>, f: (a: A) => Monad<B>) => Monad<B>;
const join: <A, B>(m: Monad<A>, f: (a: A) => Monad<B>) => Monad<B> = (m, f) =>
  f(m._wrapped_());
```

> 意义：join 的返回值为 Monad 类型，接受一个 Monad 映射到的还是 Monad，即自函子。
> 提供对 Monad 类型实例的解包。

### liftA

将一个 Monad 解包，然后应用一个非提升函数，返回新的 Monad。

```typescript
type liftA = <A, B>(m: Monad<A>, f: (a: A) => B) => Monad<B>;
const liftA: <A, B>(m: Monad<A>, f: (a: A) => B) => Monad<B> = (m, f) =>
  pure(f(m._wrapped_()));
```

> 将一个函数 lift 进 Monad 中

### fmap

和 lift 用法一样，是 Functor 类型类的方法。

### compose

一个二元运算

```typescript
const compose: <A, R1, R2>(
  f2: (a: R1) => R2,
  f1: (a: A) => R1
) => (a: A) => R2 = (f2, f1) => a => f2(f1(a));
```

## 与 Haskell Monad 比较

1. 首先创建一个 Monad。

in haskell

```haskell
async_init :: Monad m => m Integer
async_init = pure 1
```

in typescript

```typescript
type async_init = Monad<number>;
const async_init: Monad<number> = pure(1);
```

2. 使用 join 对 Monad 下层值进行(+1)操作

in haskell

```haskell
async_join_add :: Monad m => m Integer -> m Integer
async_join_add m = m >>= \a -> pure $ a + 1
```

in typescript

```typescript
type async_join_add = (m: Monad<number>) => Monad<number>;
const async_join_add: (m: Monad<number>) => Monad<number> = m =>
  join(m, a => pure(a + 1));
```

3. 使用 lift 将(+1)函数应用到 Monad

in haskell

```haskell
async_lift_add :: Monad m => m Integer -> m Integer
async_lift_add m = liftA (\a -> a + 1) m
```

in typescript

```typescript
type async_lift_add = (m: Monad<number>) => Monad<number>;
const async_lift_add: (m: Monad<number>) => Monad<number> = m =>
  liftA(m, a => a + 1);
```

4. fmap 和 lift 用法一样，这里不写了

5. main 函数

in haskell

```haskell
main :: IO ()
main = do
  -- a <- async_fmap_add $ async_lift_add $ async_join_add async_init
  a <- async_fmap_add . async_lift_add . async_join_add $ async_init
  print a
```

in typescript

```typescript
function main() {
  // const a = async_fmap_add(
  //   async_lift_add(async_join_add(async_init()))
  // )._wrapped_();

  const a = compose(
    async_fmap_add,
    compose(
      async_lift_add,
      async_join_add
    )
  )(async_init)._wrapped_();

  return pure(() => console.log(a));
}

main()._wrapped_()();
```

## 关于 Promise 和 async

Promise 就是 Monad，Promise.resolve 就是 pure，Promise.then 就是>>=。

async 就是 do block，await 就是 <- ，return 意义一样。
