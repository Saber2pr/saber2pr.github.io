import React from "react"
import "./style.less"

import Sec from "@saber2pr/secret"
import { usePush } from "@saber2pr/router"
import { store } from "../../store"

export const Secret = () => {
  const context = store.getState().context
  const meta = context.replace(/encode=|decode=/, "")

  const result = context.startsWith("en")
    ? Sec.encode(meta)
        .split("\n")
        .map(l => <p key={l}>{l}</p>)
    : Sec.decode(meta)
        .split("\n")
        .map(l => <p key={l}>{l}</p>)

  const [push] = usePush()
  if (meta === "") push("/home")

  return (
    <div className="Secret">
      <h1>禁忌</h1>
      <p>你发现了不该知道的东西...</p>
      <hr />
      {result}
    </div>
  )
}
