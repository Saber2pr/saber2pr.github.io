import './style.less'

import React from 'react'

import { freeCache } from '../../utils'

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
    freeCache('STATIC').then(() => freeCache('DYNAMIC'))
  }

  render() {
    if (this.state.hasError) {
      return (
        <dl className="ErrorBoundary">
          <dt>
            <h1>出现问题了QaQ！！不急，按照提示检查一下！</h1>
          </dt>
          <dd>{this.state.error.message}</dd>
          <dd>
            <pre>{this.state.error.stack}</pre>
          </dd>
          <dd>
            <pre>{this.state.info.componentStack}</pre>
          </dd>
          <dd>
            <p>
              <a
                className="AnchorHigh"
                href="https://github.com/Saber2pr/saber2pr.github.io/issues/new"
              >
                0. 在github上反馈问题
              </a>
            </p>
            <p>1. 检查设备是否已连接网络</p>
            <p>
              <a
                className="AnchorHigh"
                onClick={() => {
                  freeCache('STATIC').then(() => freeCache('DYNAMIC'))
                  location.reload()
                }}
              >
                2. 清除浏览器缓存
              </a>
            </p>
            <p>3. 刷新浏览器看看</p>
          </dd>
        </dl>
      )
    }
    return this.props.children
  }
}
