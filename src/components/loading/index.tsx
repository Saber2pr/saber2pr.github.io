import React from "react"
import "./style.less"

export interface Loading {}

export const Loading = ({  }: Loading) => {
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
