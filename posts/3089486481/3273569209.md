There is now one such variable (function variable, which must be of type a = > a):
```ts
const fn = a => a
```
Now the fn function reads an external variable:
```ts
import op from 'op'

// op: a => a
const fn = a => op(a)
```
So the fn function is not pure, change it like this:
```ts
const fn = (op, a) => op(a)
```
But fn must be of type a = > a, then a helper function is required:
```ts
const pure = fn => op => a => fn(op, a)

const func = pure((op, a) => op(a))

const fn = func(op)
```
This pure function takes (op, a) = > an output op = > a = > a type.
If you now need to modify the operation within func, such as op (a) becomes op (a + a), you need another helper function:
```ts
const fmap = join => func => pure(join(func))

const func2 = fmap(func => (op, a) => func(op)(a + a))

const fn = func2(func)(op)
```
Summary:
If a function needs to have side effects, write a function that generates Monad, and then write a function that operates Monad and a function that executes Monad.