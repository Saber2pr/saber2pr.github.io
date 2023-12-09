在 react 组件中发生的异常，无法使用 try/catch 捕获。

但 React Component 提供了一个错误回调接口 componentDidCatch。

这是一个示例：

```tsx
export type ErrorInfo = { componentStack: string }
export type Error = { message?: string; stack?: string }

export class ErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error?: Error; info?: ErrorInfo }
> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ hasError: true, error, info })
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
```

然后在 React 组件树根部做全局错误捕获：

```tsx
ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById("root")
)
```
