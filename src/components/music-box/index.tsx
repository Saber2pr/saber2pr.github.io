import './style.less'

import React, { useEffect, useRef, useState } from 'react'

import Audio from '@saber2pr/rc-audio'

import { request } from '../../request'
import { axios } from '../../request/axios'
import { store } from '../../store'
import { checkNetwork } from '../../utils'
import { CloseBtn } from '../close-btn'
import { LazyCom } from '../lazy-com'
import { Loading } from '../loading'
import { Model } from '../model'

type Music = {
  code: number
  data: {
    name: string
    artistsname: string
    url: string
    picurl: string
  }
}

export const status = {
  isHide: false,
  show: null,
}

const MusicAPI = 'https://api.uomg.com/api/rand.music?format=json'
const TargetUrl = 'https://music.163.com/#/song?id='

const getTargetUrl = (songUrl: string) =>
  TargetUrl +
  new URLSearchParams(new URL(songUrl).search).get('id').replace(/.mp3$/, '')

const getMusic = (musicList: object, type = Object.keys(musicList)[0]) => {
  let params = null

  const mid = musicList[type]
  if (mid) {
    params = { mid }
  } else {
    params = { sort: type }
  }

  return axios.get<Music>(MusicAPI, { params })
}

export interface MusicBox {
  close: Function
  defaultMusic: Music
  hide: Function
  show: Function
  musicList: object
}

export const MusicBox = ({
  close,
  defaultMusic,
  hide,
  show,
  musicList,
}: MusicBox) => {
  const [{ data }, setMusic] = useState<Music>(defaultMusic)
  const { url, picurl, name, artistsname } = data

  const randMusic = (type: any) =>
    getMusic(musicList, type).then(({ data }) => setMusic(data))

  const ref = useRef<HTMLSelectElement>()

  useEffect(() => {
    const { showMusic } = store.getState()
    showMusic || store.dispatch('showMusic', true)
  }, [])

  return (
    <div className="MusicBox">
      <CloseBtn
        onClick={() => {
          close()
          status.isHide = false
          status.show = null
          store.dispatch('showMusic', false)
        }}
      />
      <ul>
        <li className="MusicBox-Head">
          <select
            className="ButtonHigh"
            ref={ref}
            onChange={e => randMusic(e.target.value)}
          >
            {Object.keys(musicList).map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button
            className="ButtonHigh"
            onClick={() => randMusic(ref.current.value)}
          >
            随机歌曲
          </button>
        </li>
        <li className="MusicBox-Title">
          <a className="AnchorHigh" target="_blank" href={getTargetUrl(url)}>
            {name}-{artistsname}
          </a>
        </li>
        <li>
          <img className="MusicBox-Pic ani-rotation" src={picurl} alt={name} />
        </li>
        <li>
          <Audio autoplay src={url} />
          <span className="Block" />
          <button
            className="ButtonHigh"
            onClick={() => {
              hide()
              status.isHide = true
              status.show = show
            }}
          >
            后台播放
          </button>
        </li>
      </ul>
    </div>
  )
}

export const createMusicBox = async () => {
  if (!checkNetwork()) {
    Model.alert(({ close }) => {
      setTimeout(() => {
        close()
      }, 1000)
      return (
        <p className="Alert-Message" onClick={close}>
          无网络连接！
        </p>
      )
    })

    return
  }

  if (status.isHide && status.show) {
    status.show()
  } else {
    const musicList = await request('musicList')
    Model.Hidable(
      ({ close, show, hide }) => (
        <LazyCom await={getMusic(musicList)} fallback={<Loading />}>
          {({ data }) => (
            <MusicBox
              close={close}
              defaultMusic={data}
              hide={hide}
              show={show}
              musicList={musicList}
            />
          )}
        </LazyCom>
      ),
      ({ show }) => {
        status.isHide = true
        status.show = show
      }
    )
  }
}
