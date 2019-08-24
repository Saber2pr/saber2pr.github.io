# promisify

快速将 callback style 的 API 转为 Promise style.

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

## 原理

> 简化版，一个参数。

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

将(args, callback) => void 中 callback 重写，在 callback 中执行 promise 的 executor。

typescript 类型中对 Arg 类型只能枚举，原因是 rest 参数只能作为最后一个参数。(看一下 node 的 types 声明)
(同样的难题在 reselect 库中也发生)

> c++可变长模板参数也是如此。
