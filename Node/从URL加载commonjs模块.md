```ts
import got from 'got'
import { Module } from 'module'

/**
 * 从 URL 加载 commonjs 模块
 */
export async function requireRemote<T>(url: string) {
  const mod = new Module(url)
  const code = await got.get(url).text()
  // @ts-ignore
  // https://github.com/nodejs/node/blob/da0ede1ad55a502a25b4139f58aab3fb1ee3bf3f/lib/internal/modules/cjs/loader.js#L1055
  mod._compile(code, url)
  return mod.exports as T
}

export const requireRemoteTS = requireRemote<typeof import('typescript')>('https://cdn.jsdelivr.net/gh/microsoft/TypeScript/lib/typescript.js')
```
