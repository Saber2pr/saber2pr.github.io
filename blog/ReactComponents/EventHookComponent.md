Subscribing to dom events in react needs to be done in useEffect, and the effect hook cleans up the subscription when the component is unloaded.
It would be too troublesome to write addEventListener and removeEventListener for each subscription, so you can package this as a Hook component of useEvent:
```ts
export const useEvent = <K extends keyof WindowEventMap>(
  type: K,
  callback: (event: WindowEventMap[K]) => void,
  deps?: readonly any[]
) =>
  useEffect(() => {
    const handle = (event: WindowEventMap[K]) => callback(event)
    window.addEventListener(type, handle)
    return () => window.removeEventListener(type, handle)
  }, deps)
```
> API WindowEventMap defines the type and corresponding attributes of DOM Event.
[Complete code](https://github.com/Saber2pr/saber2pr.github.io/blob/master/src/hooks/useEvent.ts)