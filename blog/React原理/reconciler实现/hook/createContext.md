## Context Hook

context 理解为全局变量就好了，只不过约定使用 createContext 创建，使用 useContext 读取。
(如果是 class 组件，需要实现为 provider & customer，但当前只实现函数组件。)

### 实现

```typescript
function createContext<T extends Dict>(context: T) {
  return context;
}

function useContext<T extends Dict>(context: T) {
  return context;
}
```

context 初次听起来怪怪的，但是实际上它就是这样。
useContext 读取了 context，其实就已经引入了副作用，至少它访问了外部环境。需要将 Context 包装在 Monad 里才对，然后把对 Context 的操作 liftM 进 Context Monad 里。(貌似 React 内部的 useContext 会引发 rerender，应该是改变 context 后需要重新通知所有组件一次)
