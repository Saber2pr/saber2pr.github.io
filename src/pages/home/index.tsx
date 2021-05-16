import './style.less'

import React, { memo } from 'react'

import { LazyCom, Loading } from '../../components'
import { request } from '../../request'

export interface Home {
  title: string
  infor: string
  pic: string
  items: {
    type: string
    content: string
  }[]
}

export const Home = ({ title, infor, pic, items }: Home) => (
  <div className="Home">
    <ul className="Home-Ul">
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
    <div className="Home-Content">
      <section className="Home-Content-Item">
        <ul>
          {items.map(({ type, content }) => (
            <li key={type}>
              <h1 className="Home-Content-Title">{type}</h1>
              <p>{content}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </div>
)

export const HomeLazy = memo(() => (
  <LazyCom await={request("home")} fallback={<Loading type="block" />}>
    {res => <Home {...res} />}
  </LazyCom>
))
