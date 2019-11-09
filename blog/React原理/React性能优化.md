1. 组件使用 React.memo 包装，可以减少不必要的运算和请求开销。

> 或者组件内使用 useMemo，异步运算使用 useCallback。

2. 把密集运算放在 useEffect 中进行，使用 setState 渲染结果。

3. 需要同步处理的 effect 使用 useLayoutEffect 而不是 useEffect，可以快速响应渲染。

4. 使用 useState + useEffect 处理密集或异步运算时，在值未拿到的空档期使用 React.Suspense + React.lazy 显示 loading，避免页面处于无响应。

---

待更新
