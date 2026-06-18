## Ref Hook
Ref is used to index the instance of host Fiber (real DOM)
Ref is a pointer that is implemented as an object in JS, passing its reference to avoid copying values
### Ref Typ
```typescript
type RefAttributes<T extends HTMLElement> = {
  current: T;
};
```
Is an object with only one member attribute current, and the generic type is constrained to HTMLElement, that is, the T type needs to meet the condition [inherited from HTMLElement].
### When is it initialized?
Initialize when the component corresponds to Fiber commit (asynchronous initialization). This value needs to be read asynchronously within the component, for example, in useEffect, onClick, etc., the top level of the component directly reads the value null (because the component execution is synchronous)
The initialization of ref has been explained when implementing commitWork. I won't repeat it here.
## UseRef implementation
Because it essentially takes advantage of the property of object assignment and passing reference in JS. So it's very simple.
```typescript
export function useRef<T extends HTMLElement>(
  current: T = null
): React.RefAttributes<T> {
  return { current };
}
```
There's nothing to explain.
> In fact, it is lazy evaluation of ref, you can also implement it as a pure version, wrapped in Monad, for example ref = () => current