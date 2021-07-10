import './style.less'

import React, { memo, useEffect, useMemo, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

import { KeyAudio, LazyCom, Loading, M3u8, PreImg } from '../../components'
import { useIsMob } from '../../hooks'
import { request } from '../../request'
import { getArray, toArray } from '../../utils/array'
import { classnames } from '../../utils/classnames'

type Item = {
  name: string
  link: string
  avatar: string
  desc?: string | string[]
  star?: number
  audio?: string
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
  const PreImage = useMemo(
    () => (
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: shape === 'circle' ? '50%' : '12px',
          backgroundColor: 'lightgrey',
          margin: '0 auto',
          marginBottom: '0.2rem',
        }}
      />
    ),
    [shape]
  )
  return (
    <ul className={classnames('list', shape)}>
      {getArray(list).map((item, i) => (
        <li
          className="list-item"
          key={i}
          onClick={() => {
            onSelect(item)
          }}
        >
          <PreImg
            className="list-item-logo"
            src={toArray(item.avatar)[0]}
            alt={item.name}
            fallback={PreImage}
          />
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

  useEffect(() => {
    if (enter) {
      document.documentElement.scrollTop = 0
    }
  }, [enter])

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
          <div className="acgblank-content">
            {toArray(current.avatar).map((img, i) => (
              <a href={current.link} target="_blank" key={i}>
                <img src={img} />
              </a>
            ))}
            <h1 className="acgblank-content-title">
              {current.name}
              {current?.audio && <KeyAudio kw={current?.audio} />}
            </h1>
            <div>
              {toArray(current.desc).map((d, i) => (
                <p key={i}>{d}</p>
              ))}
            </div>
          </div>
          <div className="acgblank-bottom">
            <button className="ButtonHigh" onClick={() => setEnter(false)}>
              返回
            </button>
          </div>
        </div>
      )
      break
    default:
      break
  }

  const qwqlist = useMemo(() => qwq.sort((a, b) => b.star - a.star), [qwq])

  const renderList: {
    name: string
    list: List
    tip?: string
    shape?: ListProps['shape']
  }[] = [
    {
      name: '喜欢的人qwq',
      list: qwqlist,
      shape: 'circle',
    },
    {
      name: '收藏的动漫qwq',
      list: videolist,
    },
    {
      name: `收藏的游戏qaq`,
      list: h5list,
      tip: isMob ? 'PC上才可以玩哦' : null,
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
