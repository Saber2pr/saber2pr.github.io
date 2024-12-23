If a component needs to request data before displaying content, the waiting process uses the Loading component, which can be done with React.Suspense& React.lazy.
### React.lazy
Types of parameters accepted by React.lazy:
```ts
type LazyAble = () => Promise<{ default: any }>
```
The common practice is to use the import function to import the component file, which must have a default export.
```ts
React.lazy(import("/components/view"))
```
Or
```tsx
React.lazy(async () => {
  return {
    default: () => <View />
  }
})
```
In that case, is it possible to make some asynchronous requests before async return?
### LazyCom
Wait for `await` promise before async return and pass the result to children.
> ing render children
```ts
export interface LazyCom<T> {
  await: Promise<T>
  fallback: React.ReactNode
  children: (response: T) => JSX.Element
}
```
Then there is:
```tsx
export function LazyCom<T>({ children, await: wait, fallback }: LazyCom<T>) {
  const Com = React.lazy(async () => {
    const com = await wait
    return {
      default: () => children(com)
    }
  })

  return (
    <React.Suspense fallback={fallback}>
      <Com />
    </React.Suspense>
  )
}
```
[Complete code](https://github.com/Saber2pr/saber2pr.github.io/blob/master/src/components/lazy-com/index.tsx)