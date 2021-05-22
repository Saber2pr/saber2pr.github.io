import './style.less'

import React, { memo, useState } from 'react'

import { LazyCom, Loading } from '../../components'
import { request } from '../../request'
import { unstable_batchedUpdates } from 'react-dom'

export interface Game {
  list: Array<{ name: string; src: string; logo: string }>
}

export const Game = ({ list }: Game) => {
  const [enter, setEnter] = useState(false)
  const [src, setSrc] = useState<string>()

  return (
    <div className={'Game' + (enter ? ' enter' : '')}>
      <div className="list_wrap">
        {enter || (
          <ul className="list">
            {list.map(({ name, src, logo }) => (
              <li
                className="list-item"
                key={src}
                onClick={() => {
                  unstable_batchedUpdates(() => {
                    setSrc(src)
                    setEnter(true)
                  })
                }}
              >
                <img className="list-item-logo" src={logo} alt={name} />
                <div className="list-item-name">{name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {enter && (
        <div className="contain">
          <div className="game_layout">
            <iframe frameBorder="0" src={src}></iframe>
          </div>
        </div>
      )}
    </div>
  )
}

export const GameLazy = memo(() => (
  <LazyCom await={request('gamelist')} fallback={<Loading type="block" />}>
    {res => <Game {...res} />}
  </LazyCom>
))
