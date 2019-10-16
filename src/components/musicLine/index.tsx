import React from "react"
import "./style.less"
import Audio from "@saber2pr/rc-audio"
import { musicStore } from "../../store"

export interface MusicLine {
  src: string
  name: string
}

export const MusicLine = ({ src, name }: MusicLine) => {
  return (
    <div className="MusicLine">
      <Audio
        src={src}
        autoplay={musicStore.getState().music}
        start={musicStore.getState().musicCurrent}
        onChange={(status, audio) => {
          musicStore.dispatch("musicCurrent", audio.currentTime)
        }}
      />
      <span className="MusicLine-Name">{name}</span>
    </div>
  )
}
