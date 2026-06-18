# Promisify
Quickly change the API of callback style into Promise style.
```js
import { promisify } from "util"
import { readdir, readFile, stat, exists, mkdir, writeFile } from "fs"

export const ReadDir = promisify(readdir)
export const ReadFile = promisify(readFile)
export const Stat = promisify(stat)
export const Exists = promisify(exists)
export const MkDir = promisify(mkdir)
export const WriteFile = promisify(writeFile)
```
## Principle
> simplified version, one parameter.
```ts
const promiseify = <Arg, CB extends (err: Error, result: any) => any>(
  method: (arg: Arg, callback: CB) => void
) => (arg: Arg) =>
  new Promise<Parameters<CB>["1"]>((resolve, reject) => {
    const callback = (err: Error, result: any) =>
      err ? reject(err) : resolve.call(this, result)
    try {
      method.apply(null, [arg, callback])
    } catch (err) {
      reject(err)
    }
  })
```
Rewrite the callback in (args, callback) = > void, and execute the executor of promise in callback.
Arg type can only be enumerated in typescript type, because rest parameter can only be used as the last parameter. (Look at the node types declaration)
(the same problem occurs in the reselect library.)
> c++ The same is true for variable length template parameters.