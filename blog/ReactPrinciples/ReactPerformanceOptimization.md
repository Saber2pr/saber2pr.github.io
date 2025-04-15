1. Components are wrapped in React.memo to reduce unnecessary computing and request overhead.
> or use useMemo in the component and useCallback for asynchronous operations.
two。 Intensive operations are performed in useEffect and setState is used to render the results.
3. Effect that needs to be processed synchronously uses useLayoutEffect instead of useEffect and can respond quickly to rendering.
4. When using useState + useEffect to handle intensive or asynchronous operations, use React.Suspense + React.lazy to display loading during the gap when the value is not received, so as to prevent the page from becoming unresponsive.
5. After using react-redux, you no longer need to use useState. Instead, you use useSelector for better performance.
6. The design of components is in line with the principle of single responsibility, maintain purity and put an end to multi-functions of components. Improve component reusability.
7. Reading or manipulating dom must be done in useEffect or useLayoutEffect. The response is not blocked and is beneficial to SSR.
8. Make rational use of useRef to keep-live the state. Instead of using external variables to keep the component pure.
---
To be updated