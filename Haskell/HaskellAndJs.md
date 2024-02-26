In fact, a large number of Functor and Monad are already used in JS.
1. Functor For example:
In haskell
```hs
fmap (+1) [1,2,3] -- [2, 3, 4]
```
Similarly, there are in JS
```js
Array.from([1, 2, 3], x => x + 1) // [2, 3, 4]
```
2. Monad for example:
In haskell
```hs
Just 233 >>= \x -> Just $ x + 1 -- Just 234
```
Similarly, there are in JS
```js
Promise.resolve(233).then(x => x + 1) // Promise {<resolved>: 234}
```
3. Monad do-block for example:
In haskell
```hs
test :: Monad m => m Integer
test = pure 233

result :: Monad m => m Integer
result = do
  value <- test
  return $ value + 1
```
Similarly, there are in JS
```js
const test = Promise.resolve(233)

const result = async () => {
  const value = await test
  return value + 1
}
```