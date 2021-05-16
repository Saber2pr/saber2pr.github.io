import './style.less'

import React from 'react'

export interface CloseBtn {
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const CloseBtn = ({ onClick }: CloseBtn) => (
  <div title="关闭" className="CloseBtn" onClick={onClick}>
    <div />
    <div />
  </div>
)
