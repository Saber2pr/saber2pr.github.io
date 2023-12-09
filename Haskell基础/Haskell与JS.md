在 JS 中其实已经使用了大量的 Functor 和 Monad。

1. Functor 例如：

在 haskell 中

```hs
fmap (+1) [1,2,3] -- [2, 3, 4]
```

同样的在 JS 中有

```js
Array.from([1, 2, 3], x => x + 1) // [2, 3, 4]
```

2. Monad 例如：

在 haskell 中

```hs
Just 233 >>= \x -> Just $ x + 1 -- Just 234
```

同样的在 JS 中有

```js
Promise.resolve(233).then(x => x + 1) // Promise {<resolved>: 234}
```

3. Monad do-block 例如：

在 haskell 中

```hs
test :: Monad m => m Integer
test = pure 233

result :: Monad m => m Integer
result = do
  value <- test
  return $ value + 1
```

同样的在 JS 中有

```js
const test = Promise.resolve(233)

const result = async () => {
  const value = await test
  return value + 1
}
```
