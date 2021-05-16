import './style.less'

import React from 'react'

import { usePush } from '@saber2pr/react-router'
import Sec from '@saber2pr/secret'

import { Routes } from '../../config'
import { store } from '../../store'

export const Secret = () => {
  const context = store.getState().context
  const [push] = usePush()
  if (typeof context !== "string") {
    push(Routes.home.href)
    return <></>
  }
  const meta = context.replace(/encode=|decode=/, "")
  if (meta === "") {
    push(Routes.home.href)
    return <></>
  }

  const result = context.startsWith("en")
    ? Sec.encode(meta)
        .split("\n")
        .map(l => <p key={l}>{l}</p>)
    : Sec.decode(meta)
        .split("\n")
        .map(l => <p key={l}>{l}</p>)

  return (
    <div className="Secret">
      <h1>禁忌</h1>
      <p>你发现了不该知道的东西...</p>
      <hr />
      {result}
    </div>
  )
}
