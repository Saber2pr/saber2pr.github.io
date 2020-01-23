import React, { useState, useRef } from "react"
import "./style.less"
import { axios } from "../../request/axios"
import Audio from "@saber2pr/rc-audio"
import { Model } from "../model"
import { LazyCom } from "../lazy-com"
import { Loading } from "../loading"
import { CloseBtn } from "../close-btn"
import { checkNetwork } from "../../utils"

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
  show: null
}

const MusicAPI = "https://api.uomg.com/api/rand.music?format=json"
const TargetUrl = "https://music.163.com/#/song?id="

const getTargetUrl = (songUrl: string) =>
  TargetUrl +
  new URLSearchParams(new URL(songUrl).search).get("id").replace(/.mp3$/, "")

type MusicType = "热歌榜" | "新歌榜" | "抖音榜" | "电音榜" | "我的收藏"

const getMusic = (type: MusicType = "我的收藏") =>
  axios.get<Music>(MusicAPI, {
    params: type === "我的收藏" ? { mid: "587356828" } : { sort: type }
  })

export interface MusicBox {
  close: Function
  defaultMusic: Music
  hide: Function
  show: Function
}

export const MusicBox = ({ close, defaultMusic, hide, show }: MusicBox) => {
  const [{ data }, setMusic] = useState<Music>(defaultMusic)
  const { url, picurl, name, artistsname } = data

  const randMusic = (type: any) =>
    getMusic(type).then(({ data }) => setMusic(data))

  const ref = useRef<HTMLSelectElement>()

  return (
    <div className="MusicBox">
      <CloseBtn
        onClick={() => {
          close()
          status.isHide = false
          status.show = null
        }}
      />
      <ul>
        <li className="MusicBox-Head">
          <select
            className="ButtonHigh"
            ref={ref}
            onChange={e => randMusic(e.target.value)}
          >
            <option value="我的收藏">我的收藏</option>
            <option value="热歌榜">热歌榜</option>
            <option value="新歌榜">新歌榜</option>
            <option value="抖音榜">抖音榜</option>
            <option value="电音榜">电音榜</option>
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

export const createMusicBox = () => {
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
    Model.Hidable(
      ({ close, show, hide }) => (
        <LazyCom await={getMusic()} fallback={<Loading />}>
          {({ data }) => (
            <MusicBox
              close={close}
              defaultMusic={data}
              hide={hide}
              show={show}
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
