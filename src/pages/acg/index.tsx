import './style.less'

import React, { memo, useMemo, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

import { LazyCom, Loading, M3u8 } from '../../components'
import { useIsMob } from '../../hooks'
import { request } from '../../request'

type Item = { name: string; src: string; logo: string }
type List = Array<Item>

export interface Acg {
  h5list: List
  videolist: List
}

const List = ({
  list,
  onSelect,
}: {
  list: List
  onSelect: (item: Item) => void
}) => {
  return (
    <ul className="list">
      {list.map((item, i) => (
        <li
          className="list-item"
          key={i}
          onClick={() => {
            onSelect(item)
          }}
        >
          <img className="list-item-logo" src={item.logo} alt={item.name} />
          <div className="list-item-name">{item.name}</div>
        </li>
      ))}
    </ul>
  )
}

export const Acg = ({ h5list, videolist }: Acg) => {
  const [enter, setEnter] = useState(false)
  const [current, setCurrent] = useState<Item>()
  const isMob = useIsMob()

  const type = useMemo(() => {
    if (!current) return
    if (current?.src.includes('.html')) return 'h5'
    if (current?.src.includes('.m3u8')) return 'video'
  }, [current])

  let content = <></>
  switch (type) {
    case 'h5':
      content = (
        <iframe
          className="contain-layout-content"
          frameBorder="0"
          src={current?.src}
        ></iframe>
      )
      break
    case 'video':
      content = (
        <>
          {isMob && <h3 className="video_title">{current.name}</h3>}
          <M3u8 src={current?.src} />
        </>
      )
      break
    default:
      break
  }

  return (
    <div className={'Acg' + (enter ? ' enter' : '')}>
      <div className="list_wrap">
        {enter || (
          <ul className="category">
            {[
              {
                name: `收藏的游戏qaq`,
                list: h5list,
                tip: isMob ? 'PC上才可以玩哦' : null,
              },
              {
                name: '收藏的动漫qwq',
                list: videolist,
              },
            ].map(({ name, list, tip }, i) => (
              <li className="category-item" key={i}>
                <h3 className="category-item-name">{name}</h3>
                <div className="category-item-list">
                  <List
                    list={list}
                    onSelect={src => {
                      unstable_batchedUpdates(() => {
                        setCurrent(src)
                        setEnter(true)
                      })
                    }}
                  />
                </div>
                {tip && <div className="category-item-tip">提示：{tip}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {enter && (
        <div className="contain">
          <div className="contain-layout">{content}</div>
        </div>
      )}
    </div>
  )
}

export const AcgLazy = memo(() => (
  <LazyCom await={request('acglist')} fallback={<Loading type="block" />}>
    {res => <Acg {...res} />}
  </LazyCom>
))
