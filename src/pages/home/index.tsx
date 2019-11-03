import React from "react"
import "./style.less"
import { LazyCom, Loading } from "../../components"
import { request } from "../../request"

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
  </ul>
)

export const HomeLazy = () => (
  <LazyCom await={request("home")} fallback={<Loading />}>
    {JHome => <Home {...JHome} />}
  </LazyCom>
)
