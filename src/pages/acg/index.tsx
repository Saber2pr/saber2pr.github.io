import './style.less'

import React, { memo, useMemo, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

import { LazyCom, Loading, M3u8 } from '../../components'
import { request } from '../../request'

type Item = { name: string; src: string; logo: string }
type List = Array<Item>

export interface Acg {
  list: List
}

const List = ({
  list,
  onSelect,
}: {
  list: List
  onSelect: (src: string) => void
}) => {
  return (
    <ul className="list">
      {list.map(({ name, src, logo }, i) => (
        <li
          className="list-item"
          key={i}
          onClick={() => {
            onSelect(src)
          }}
        >
          <img className="list-item-logo" src={logo} alt={name} />
          <div className="list-item-name">{name}</div>
        </li>
      ))}
    </ul>
  )
}

export const Acg = ({ list }: Acg) => {
  const [enter, setEnter] = useState(false)
  const [src, setSrc] = useState<string>()

  const catelist = useMemo(() => {
    const h5list: Item[] = []
    const videolist: Item[] = []
    list.forEach(item => {
      const src = item.src
      if (src.includes('.html')) {
        h5list.push(item)
      }
      if (src.includes('.m3u8')) {
        videolist.push(item)
      }
    })
    return [
      {
        name: '收藏的游戏qaq',
        list: h5list,
      },
      {
        name: '收藏的动漫qwq',
        list: videolist,
      },
    ]
  }, [list])

  const type = useMemo(() => {
    if (!src) return
    if (src.includes('.html')) return 'h5'
    if (src.includes('.m3u8')) return 'video'
  }, [src])

  let content = <></>
  switch (type) {
    case 'h5':
      content = (
        <iframe
          width="100%"
          className="contain-layout-content"
          frameBorder="0"
          src={src}
        ></iframe>
      )
      break
    case 'video':
      content = <M3u8 src={src} />
      break
    default:
      break
  }

  return (
    <div className={'Acg' + (enter ? ' enter' : '')}>
      <div className="list_wrap">
        {enter || (
          <ul className="category">
            {catelist.map(({ name, list }, i) => (
              <li className="category-item" key={i}>
                <h3 className="category-item-name">{name}</h3>
                <div className="category-item-list">
                  <List
                    list={list}
                    onSelect={src => {
                      unstable_batchedUpdates(() => {
                        setSrc(src)
                        setEnter(true)
                      })
                    }}
                  />
                </div>
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
