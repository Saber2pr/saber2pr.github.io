import React from "react"
import "./style.less"

import Sec from "@saber2pr/secret"
import { usePush } from "@saber2pr/react-router"
import { store } from "../../store"
import { Routes } from "../../config"

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
