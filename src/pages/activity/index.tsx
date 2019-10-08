import React, { useState } from "react"
import "./style.less"

import MD from "@saber2pr/md2jsx"
import { origin, md_theme } from "../../config"
import { lift, timeDeltaFromNow, checkDarkTime } from "../../utils"
import { Icon } from "../../iconfont"
import { useOnScrollBottom } from "../../hooks/useOnScrollBottom"
import { LazyCom, Loading } from "../../components"
import { request } from "../../request"

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

export const Activity = ({ acts }: Activity) => {
  const [length, setLength] = useState(10)
  const hasMore = length <= acts.length
  useOnScrollBottom(() => hasMore && setLength(length + 10))
  return (
    <div className="Activity">
      <ul>
        {acts.slice(0, length).map(({ type, text, date }, i) => (
          <li key={text + i}>
            <dl className="Activity-Content">
              <dt className="Activity-Type">
                <strong>{matchType(type)}</strong>
              </dt>
              <dd>
                <ul>
                  <li>
                    <MD theme={md_theme}>{matchText(type, text)}</MD>
                  </li>
                  <li className="Activity-Time">
                    <p>{timeDeltaFromNow(date)}</p>
                  </li>
                </ul>
              </dd>
              <dd>
                <hr />
              </dd>
            </dl>
          </li>
        ))}
        <li>
          <div
            style={{
              textAlign: "center",
              width: "100%"
            }}
          >
            {hasMore && (
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setLength(length + 5)}
              >
                更多
              </span>
            )}
          </div>
        </li>
      </ul>
      {checkDarkTime() && (
        <div className="Activity-Aside" title="from sayo...">
          <p>
            <i>无意义记号的罗列</i>
          </p>
          <p>
            <i>无意义语言的增殖</i>
          </p>
          <p>
            <i>无意义行为的重复</i>
          </p>
        </div>
      )}
    </div>
  )
}

export const ActivityLazy = () => (
  <LazyCom await={request("activity")} fallback={<Loading />}>
    {JActs => <Activity acts={JActs} />}
  </LazyCom>
)
