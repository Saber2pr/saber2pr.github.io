import React, { useState } from "react"
import "./style.less"
import Audio from "@saber2pr/rc-audio"
import { musicStore } from "../../store"
import { useEvent } from "../../hooks"
import { getHash } from "@saber2pr/react-router"

export interface MusicLine {
  src: string
  name: string
}

export const MusicLine = ({ src, name }: MusicLine) => {
  const select = () => (getHash() === "/" ? "transparent" : "inherit")
  const [backgroundColor, setBg] = useState<"transparent" | "inherit">(select())
  useEvent("hashchange", () => setBg(select()), [])
  return (
    <div className="MusicLine">
      <span
        onClick={() =>
          musicStore.dispatch("music", !musicStore.getState().music)
        }
        style={{ backgroundColor }}
      >
        <Audio
          src={src}
          autoplay={musicStore.getState().music}
          start={musicStore.getState().musicCurrent}
          onChange={(_, audio) => {
            musicStore.dispatch("musicCurrent", audio.currentTime)
          }}
        />
      </span>
      <span className="MusicLine-Name">{name}</span>
    </div>
  )
}
