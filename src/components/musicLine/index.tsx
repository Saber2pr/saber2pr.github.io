import React from "react"
import "./style.less"
import Audio from "@saber2pr/rc-audio"
import { store } from "../../store"

export interface MusicLine {
  src: string
  name: string
}

export const MusicLine = ({ src, name }: MusicLine) => {
  const { musicCurrent, music } = store.getState()
  return (
    <div className="MusicLine">
      <Audio
        src={src}
        autoplay={music}
        start={musicCurrent}
        onChange={(_, audio) => {
          store.dispatch("musicCurrent", audio.currentTime)
        }}
      />
      <span className="MusicLine-Name">{name}</span>
    </div>
  )
}
