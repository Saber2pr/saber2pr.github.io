import './style.less'

import React, { memo, useMemo, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

import { LazyCom, Loading, M3u8 } from '../../components'
import { useIsMob } from '../../hooks'
import { request } from '../../request'
import { classnames } from '../../utils/classnames'

type Item = {
  name: string
  link: string
  avatar: string
  desc?: string | string[]
}
type List = Array<Item>

export interface Acg {
  h5list: List
  videolist: List
  qwq: List
}

type ListProps = {
  list: List
  onSelect: (item: Item) => void
  shape?: 'rect' | 'circle'
}

const List = ({ list, onSelect, shape }: ListProps) => {
  return (
    <ul className={classnames('list', shape)}>
      {list.map((item, i) => (
        <li
          className="list-item"
          key={i}
          onClick={() => {
            onSelect(item)
          }}
        >
          <img className="list-item-logo" src={item.avatar} alt={item.name} />
          <div className="list-item-name">{item.name}</div>
        </li>
      ))}
    </ul>
  )
}

export const Acg = ({ h5list, videolist, qwq }: Acg) => {
  const [enter, setEnter] = useState(false)
  const [current, setCurrent] = useState<Item>()
  const isMob = useIsMob()

  const type = useMemo(() => {
    if (!current) return
    const link = current.link
    if (/\.html/.test(link)) return 'h5'
    if (/\.m3u8/.test(link)) return 'm3u8'
    if (/\.mp4/.test(link)) return 'mp4'
    return 'blank'
  }, [current])

  let content = <></>
  switch (type) {
    case 'h5':
      content = (
        <iframe
          className="contain-layout-content"
          frameBorder="0"
          src={current?.link}
        ></iframe>
      )
      break
    case 'mp4':
      content = (
        <video
          autoPlay
          controls
          className="contain-layout-content"
          src={current?.link}
        ></video>
      )
      break
    case 'm3u8':
      content = (
        <>
          {isMob && <h3 className="video_title">{current.name}</h3>}
          <M3u8 src={current?.link} />
        </>
      )
      break
    case 'blank':
      content = (
        <div className="acgblank">
          <a href={current.link} target="_blank">
            <img src={current.avatar} />
          </a>
          <h1>{current.name}</h1>
          <div>
            {[].concat(current.desc).map((d, i) => (
              <p key={i}>{d}</p>
            ))}
          </div>
        </div>
      )
      break
    default:
      break
  }

  const renderList: {
    name: string
    list: List
    tip?: string
    shape?: ListProps['shape']
  }[] = [
    {
      name: `收藏的游戏qaq`,
      list: h5list,
      tip: isMob ? 'PC上才可以玩哦' : null,
    },
    {
      name: '收藏的动漫qwq',
      list: videolist,
    },
    {
      name: '喜欢的人qwq',
      list: qwq,
      shape: 'circle',
    },
  ]

  return (
    <div className={'Acg' + (enter ? ' enter' : '')}>
      <div className="list_wrap">
        {enter || (
          <ul className="category">
            {renderList.map(({ name, list, tip, shape }, i) => (
              <li className="category-item" key={i}>
                <h3 className="category-item-name">{name}</h3>
                <div className="category-item-list">
                  <List
                    list={list}
                    shape={shape}
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
