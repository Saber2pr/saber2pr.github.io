import './style.less'

import React, { memo, useEffect, useState } from 'react'

import { get163Msg } from '../../api'
import { LazyCom, Loading, WordsInputing } from '../../components'
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

const LiveComment = () => {
  const [msg, setMsg] = useState<string>()
  useEffect(() => {
    get163Msg().then(text => {
      setMsg(text)
    })
  }, [])

  return (
    <>
      {msg && (
        <WordsInputing
          inputs={msg}
          key={msg}
          next={() =>
            setTimeout(
              () =>
                get163Msg().then(text => {
                  setMsg(text)
                }),
              3000
            )
          }
        />
      )}
    </>
  )
}

export const Home = ({ title, infor, pic, items }: Home) => {
  return (
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
      <div className="Home-Comment">
        <LiveComment />
      </div>
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
}

export const HomeLazy = memo(() => (
  <LazyCom await={request('home')} fallback={<Loading type="block" />}>
    {res => <Home {...res} />}
  </LazyCom>
))
