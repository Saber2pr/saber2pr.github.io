next/publicRuntimeConfig 用的比较多，但是这个内部实现没有泛型提供，getConfig 返回 any 类型。

有两种办法，第一种直接封装一个新的可以支持泛型的 getConfig 函数。

第二种，声明合并（推荐）：

```ts
// next-env.d.ts
declare module 'next/config' {
  export default getConfig as () => {
    publicRuntimeConfig: Readonly<{
      api: string
      // ...
    }>
  }
}
```
