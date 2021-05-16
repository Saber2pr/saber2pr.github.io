import './iconfont.css'

import React from 'react'

export namespace Icon {
  export const Sousuo = () => <i className="iconfont icon-xiazai15" />
  export const DarkTheme = () => (
    <i className="iconfont icon-yejianmoshi" title="夜间模式" />
  )
  export const LightTheme = () => (
    <i className="iconfont icon-baitianmoshimingliangmoshi" title="日间模式" />
  )
  export const Head = () => <i className="iconfont icon-icon26" />
  export const Create = () => <i className="iconfont icon-create" />
  export const Delete = () => <i className="iconfont icon-delete" />
  export const Update = () => <i className="iconfont icon-update" />
  export const Idea = () => <i className="iconfont icon-idea" />
  export const Top = () => <i className="iconfont icon-top" />
  export const BtnTop = () => (
    <svg
      viewBox="0 0 926.23699 573.74994"
      version="1.1"
      x="0px"
      y="0px"
      width="15"
      height="15"
      style={{ transform: "rotate(180deg)" }}
    >
      <g transform="translate(904.92214,-879.1482)">
        <path
          d="
  m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,
  -55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,
  0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,
  -174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,
  -174.68583 0.6895,0 26.281,25.03215 56.8701,
  55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864
  -231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,
  -104.0616 -231.873,-231.248 z
  "
          fill="currentColor"
        />
      </g>
    </svg>
  )
  export const BtnBtm = () => (
    <svg
      viewBox="0 0 926.23699 573.74994"
      version="1.1"
      x="0px"
      y="0px"
      width="15"
      height="15"
    >
      <g transform="translate(904.92214,-879.1482)">
        <path
          d="
  m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,
  -55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,
  0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,
  -174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,
  -174.68583 0.6895,0 26.281,25.03215 56.8701,
  55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864
  -231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,
  -104.0616 -231.873,-231.248 z
  "
          fill="currentColor"
        />
      </g>
    </svg>
  )
  export const TreeBtn = (
    isAct: boolean,
    actRad = "180deg",
    unactRad = "0deg",
    mode = "rotateX"
  ) => (
    <svg
      viewBox="0 0 926.23699 573.74994"
      version="1.1"
      x="0px"
      y="0px"
      width="10"
      height="10"
      style={{
        transform: `${mode}(${isAct ? actRad : unactRad})`,
        transition: "transform 0.2s ease"
      }}
    >
      <g transform="translate(904.92214,-879.1482)">
        <path
          d="
  m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,
  -55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,
  0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,
  -174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,
  -174.68583 0.6895,0 26.281,25.03215 56.8701,
  55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864
  -231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,
  -104.0616 -231.873,-231.248 z
"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
