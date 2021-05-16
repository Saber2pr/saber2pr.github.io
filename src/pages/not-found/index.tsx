import './style.less'

import React from 'react'

import { usePush } from '@saber2pr/react-router'

import { Routes } from '../../config'

export interface NotFound {}

export const NotFound = ({  }: NotFound) => {
  const [push] = usePush()
  return (
    <div className="NotFound">
      <h1>诶！？页面走丢了QAQ！</h1>
      <h1>404 NotFound</h1>
      <ul>
        <li>
          <button className="ButtonHigh" onClick={() => push(Routes.home.href)}>
            首页
          </button>
        </li>
        <li>
          <a className="AnchorHigh" onClick={() => history.back()}>
            或者返回上页
          </a>
        </li>
      </ul>
    </div>
  )
}
