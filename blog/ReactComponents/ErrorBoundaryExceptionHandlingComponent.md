Exceptions that occur in the react component cannot be caught using try/catch.
However, React Component provides an error callback interface componentDidCatch.
This is an example:
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
Then do global error trapping at the root of the React component tree:
```tsx
ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById("root")
)
```