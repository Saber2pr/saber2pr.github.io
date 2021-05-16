import './style.less'

import React from 'react'

export interface ErrorBack {}

export const ErrorBack = ({  }: ErrorBack) => {
  return (
    <div className="ErrorBack">
      <dl>
        <dt>网络异常，请尝试：</dt>
        <dd>
          <ol>
            <li>检查网络连接</li>
            <li>
              刷新页面
              <button className="ButtonHigh" onClick={() => location.reload()}>
                刷新
              </button>
            </li>
          </ol>
        </dd>
      </dl>
    </div>
  )
}
