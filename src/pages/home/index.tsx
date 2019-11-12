import React, { memo } from "react"
import "./style.less"
import { LazyCom, Loading } from "../../components"
import { request, API } from "../../request"

export interface Home {
  title: string
  infor: string
}

export const Home = ({ title, infor }: Home) => (
  <ul className="Home">
    <li className="Home-Title shd-blue">
      <i>{title}</i>
    </li>
    <li className="Home-Infor">
      <i>{infor}</i>
    </li>
    <li className="Home-Img">
      <img src={API.createAvatars("saber2pr", 1000)} alt="saber2pr" />
    </li>
  </ul>
)

export const HomeLazy = memo(() => (
  <LazyCom await={request("home")} fallback={<Loading />}>
    {JHome => <Home {...JHome} />}
  </LazyCom>
))
