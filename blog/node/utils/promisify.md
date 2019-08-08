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
