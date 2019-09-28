import React from "react"
import "./style.less"

import MD from "@saber2pr/md2jsx"
import { origin, md_theme } from "../../config"
import { lift, timeDeltaFromNow } from "../../utils"
import { Icon } from "../../iconfont"

type Act = {
  type: "update" | "create" | "delete"
  text: string
  date: string
}

export interface Activity {
  acts: Act[]
}

const matchType = (type: Act["type"]) => {
  switch (type) {
    case "update":
      return (
        <p>
          <Icon.Update />
          更新
        </p>
      )
    case "create":
      return (
        <p>
          <Icon.Create />
          创建
        </p>
      )
    case "delete":
      return (
        <p>
          <Icon.Delete />
          删除
        </p>
      )
    default:
      return (
        <p>
          <Icon.Idea />
          {type}
        </p>
      )
  }
}

const matchText = (type: Act["type"], text: Act["text"]) => {
  if ((["create", "update"] as Act["type"][]).includes(type)) {
    return lift(
      text.split(".")[0],
      href => `[${href.split("/").pop()}](#${origin.md + href})`
    )
  }
  if (type === "delete") {
    return text
      .split(".")[0]
      .split("/")
      .pop()
  }

  return text
}

export const Activity = ({ acts }: Activity) => (
  <table className="Activity">
    <tbody>
      {acts.map(({ type, text, date }, i) => (
        <tr key={text + i}>
          <th className="Activity-Type">{matchType(type)}</th>
          <td>
            <MD theme={md_theme}>{matchText(type, text)}</MD>
            <p className="Activity-Time">{timeDeltaFromNow(date)}</p>
            <hr />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)
