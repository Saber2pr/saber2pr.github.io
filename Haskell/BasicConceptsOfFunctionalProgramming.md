### Basic Concepts of Haskell functional programming
1. Functor
```hs
fmap (+1) [1,2,3] -- [2,3,4]

(+1) <$> [1,2,3] -- [2,3,4]

(+1) <$> Just 1 -- Just 2
```
2. Applicative
```hs
Just (+1) <*> Just 1 -- Just 2
```
3. Monad
```hs
Just 1 >>= \x -> Just $ x + 1 -- Just 2

Just 1 >>= \x -> pure $ x + 1 -- Just 2

Just 1 >>= \x -> return $ x + 1 -- Just 2
```
Do block
```hs
module Main where

test :: Monad m => m Integer
test = pure 233

result :: Monad m => m Integer
result = do
  value <- test
  return $ value + 1

main :: IO ()
main = result >>= print
```