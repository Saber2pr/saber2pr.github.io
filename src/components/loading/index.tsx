import React from "react"
import "./style.less"

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

  return (
    <div className="Loading">
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
    </div>
  )
}
