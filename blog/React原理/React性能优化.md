1. 组件使用 React.memo 包装，可以减少不必要的运算和请求开销。

> 或者组件内使用 useMemo，异步运算使用 useCallback。

2. 把密集运算放在 useEffect 中进行，使用 setState 渲染结果。

3. 需要同步处理的 effect 使用 useLayoutEffect 而不是 useEffect，可以快速响应渲染。

4. 使用 useState + useEffect 处理密集或异步运算时，在值未拿到的空档期使用 React.Suspense + React.lazy 显示 loading，避免页面处于无响应。

5. 使用 react-redux 后，不需要再使用 useState。而是使用 useSelector，性能更好。

6. 组件设计符合单一职责原则，保持纯度，杜绝组件多功能。提高组件复用性。

7. 读取或操作 dom 必须在 useEffect 或 useLayoutEffect 中进行。不阻塞响应并且有利于 SSR。

8. 合理利用 useRef 对状态进行 keep-live。而不是使用外部变量，使组件保持纯度。

---

待更新
