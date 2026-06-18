Next/publicRuntimeConfig is used a lot, but this internal implementation is not provided with generics, and getConfig returns the any type.
There are two ways. The first is to directly wrap a new getConfig function that supports generics.
Second, declare the merge (recommended):
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