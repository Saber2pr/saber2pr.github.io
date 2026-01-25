Since there is no type for Monad in TS, the infrastructure is implemented first.
> ly do simple implementation, and focus on comparing with haskell code style.
> jective: to deepen the understanding of Monad.
### Monad
A value (laziness) is saved in Monad. So it can be defined this way.
```typescript
type Monad<T> = {
  readonly _wrapped_: () => T;
};
```
Wrapped is a value wrapper that inerts a value.
> aning: a series of operations used to preserve the value context and concatenate the value
>  the upper level relative to the normal value type
> nad is a type class in haskell
### Return
Also known as pure. Raise a value to Monad.
```typescript
type pure = <T>(a: T) => Monad<T>;
const pure: <T>(a: T) => Monad<T> = value => ({
  _wrapped_: () => Object.freeze(value)
});
```
> aning: inerting a value
### Join
Unpack a Monad and then apply a promotion function to return the new Monad.
```typescript
type join = <A, B>(m: Monad<A>, f: (a: A) => Monad<B>) => Monad<B>;
const join: <A, B>(m: Monad<A>, f: (a: A) => Monad<B>) => Monad<B> = (m, f) =>
  f(m._wrapped_());
```
> meaning: the return value of join is of type Monad, and it accepts that a Monad is mapped to Monad, that is, a self-functor.
> provides unpacking for instances of Monad type.
### LiftA
Unpack a Monad and then apply a non-lifting function to return a new Monad.
```typescript
type liftA = <A, B>(m: Monad<A>, f: (a: A) => B) => Monad<B>;
const liftA: <A, B>(m: Monad<A>, f: (a: A) => B) => Monad<B> = (m, f) =>
  pure(f(m._wrapped_()));
```
> tting a function lift into Monad
### fmap
As with lift, it is a method of the Functor type class.
### Compose
A binary operation
```typescript
const compose: <A, R1, R2>(
  f2: (a: R1) => R2,
  f1: (a: A) => R1
) => (a: A) => R2 = (f2, f1) => a => f2(f1(a));
```
## Compare with Haskell Monad
1. First create a Monad.
In haskell
```haskell
async_init :: Monad m => m Integer
async_init = pure 1
```
In typescript
```typescript
type async_init = Monad<number>;
const async_init: Monad<number> = pure(1);
```
two。 Use join to perform (+ 1) operations on lower-level values of Monad
In haskell
```haskell
async_join_add :: Monad m => m Integer -> m Integer
async_join_add m = m >>= \a -> pure $ a + 1
```
In typescript
```typescript
type async_join_add = (m: Monad<number>) => Monad<number>;
const async_join_add: (m: Monad<number>) => Monad<number> = m =>
  join(m, a => pure(a + 1));
```
3. Apply the (+ 1) function to Monad using lift
In haskell
```haskell
async_lift_add :: Monad m => m Integer -> m Integer
async_lift_add m = liftA (\a -> a + 1) m
```
In typescript
```typescript
type async_lift_add = (m: Monad<number>) => Monad<number>;
const async_lift_add: (m: Monad<number>) => Monad<number> = m =>
  liftA(m, a => a + 1);
```
4. Fmap is the same as lift, but it's not written here.
5. Main function
In haskell
```haskell
main :: IO ()
main = do
  -- a <- async_fmap_add $ async_lift_add $ async_join_add async_init
  a <- async_fmap_add . async_lift_add . async_join_add $ async_init
  print a
```
In typescript
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
## About Promise and async
Promise is Monad,Promise.resolve and pure,Promise.then is >.
Async is do block,await is < -, return means the same thing.