import React, { useState, useEffect } from "react"
import "./style.less"

import { origin } from "../../config"
import { timeDeltaFromNow, checkDarknessTime } from "../../utils"
import { Icon } from "../../iconfont"
import { useOnScrollBottom } from "../../hooks/useOnScrollBottom"
import { LazyCom, Loading, ScrollToTop } from "../../components"
import { request, requestContent } from "../../request"
import { store } from "../../store"
import { Link } from "@saber2pr/react-router"

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
    return (
      <strong>
        {text
          .split(".")[0]
          .split("/")
          .pop()}
      </strong>
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

const Info = ({ path }: { path: string }) => (
  <LazyCom await={requestContent(origin.md + path)} fallback={<Loading />}>
    {res => (
      <p className="Activity-Info">
        {res.slice(0, 60)}...
        <Link to={origin.md + path.split(".")[0]}>查看内容</Link>
      </p>
    )}
  </LazyCom>
)

export const Activity = ({ acts }: Activity) => {
  const deleted = acts.filter(a => a.type === "delete").map(d => d.text)
  const [length, setLength] = useState(store.getState().actLen)
  const hasMore = length <= acts.length
  useOnScrollBottom(() => {
    if (hasMore) {
      setLength(length + 10)
      store.dispatch("actLen", length + 10)
    }
  })

  useEffect(() => {
    const d = document.documentElement
    setTimeout(() => {
      d.scrollTop = store.getState().actsScrollTop
    }, 100)
    return () => store.dispatch("actsScrollTop", d.scrollTop)
  }, [])

  return (
    <div className="Activity">
      <ul>
        {acts.slice(0, length).map(({ type, text, date }, i) => (
          <li key={text + i}>
            <div className="Activity-Content">
              <div className="Activity-Type">
                <strong>{matchType(type)}</strong>
              </div>
              <ul>
                <li className="Activity-Name">{matchText(type, text)}</li>
                {type !== "delete" && !deleted.includes(text) && (
                  <li>
                    <Info path={text} />
                  </li>
                )}
                <li className="Activity-Time">
                  <p>{timeDeltaFromNow(date)}</p>
                </li>
              </ul>
            </div>
            <hr />
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
      {checkDarknessTime() && (
        <div className="Activity-Aside" title="by saber2pr qwq..">
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
      <ScrollToTop />
    </div>
  )
}

export const ActivityLazy = () => (
  <LazyCom await={request("activity")} fallback={<Loading />}>
    {JActs => <Activity acts={JActs} />}
  </LazyCom>
)
