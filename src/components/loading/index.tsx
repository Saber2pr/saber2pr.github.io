import React, { useState, useEffect } from "react"
import "./style.less"
import { origin } from "../../config"

export interface Loading {
  type?: "block" | "unset" | "line"
}

export const Loading = ({ type = "unset" }: Loading) => {
  if (type !== "unset") {
    return (
      <div
        style={{
          position: "relative",
          height: type === "block" ? "60vh" : "50vh"
        }}
      >
        <Loading />
      </div>
    )
  }

  const [message, setMessage] = useState(<></>)

  useEffect(() => {
    const handle = setTimeout(() => {
      setMessage(
        <div className="Message">
          等待时间太长？访问[<a href={"//" + origin.mirror}>加速版</a>].
        </div>
      )
    }, 4000)

    return () => clearTimeout(handle)
  }, [])

  return (
    <div className="Loading">
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      {message}
    </div>
  )
}
