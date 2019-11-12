import React, { memo } from "react"
import "./style.less"
import { LazyCom, Loading } from "../../components"
import { request } from "../../request"

export interface Home {
  title: string
  infor: string
  pic: string
}

export const Home = ({ title, infor, pic }: Home) => (
  <ul className="Home">
    <li className="Home-Title shd-blue">
      <i>{title}</i>
    </li>
    <li className="Home-Infor">
      <i>{infor}</i>
    </li>
    <li className="Home-Img">
      <img src={pic} alt={title} />
    </li>
  </ul>
)

export const HomeLazy = memo(() => (
  <LazyCom await={request("home")} fallback={<Loading />}>
    {res => <Home {...res} />}
  </LazyCom>
))
