import React from "react"
import "./style.less"

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
      return (
        <dl className="ErrorBoundary">
          <dt>
            <h1>Something went wrong.</h1>
          </dt>
          <dd>{this.state.error.message}</dd>
          <dd>
            <pre>{this.state.error.stack}</pre>
          </dd>
          <dd>
            <pre>{this.state.info.componentStack}</pre>
          </dd>
          <dd>
            <a
              className="AnchorHigh"
              href="https://github.com/Saber2pr/saber2pr.github.io/issues/new"
            >
              create an issue for saber2pr.github.io.
            </a>
          </dd>
        </dl>
      )
    }
    return this.props.children
  }
}
