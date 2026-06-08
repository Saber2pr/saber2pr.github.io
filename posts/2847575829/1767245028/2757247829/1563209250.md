## Context Hook
Context can be understood as a global variable, but it is agreed to be created using createContext and read using useContext.
(in the case of class components, you need to implement provider & customer, but currently only functional components are implemented.)
### Realize
```typescript
function createContext<T extends Dict>(context: T) {
  return context;
}

function useContext<T extends Dict>(context: T) {
  return context;
}
```
Context sounds weird at first, but in fact it is.
When useContext reads context, it already introduces side effects, at least it accesses the external environment. You need to wrap the Context in Monad, and then liftM the operation on Context into Context Monad. (it seems that the useContext within React will cause rerender, so you need to notify all components again after changing the context.)