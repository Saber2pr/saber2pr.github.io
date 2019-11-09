import React from "react"
import Audio from "@saber2pr/rc-audio"

import { TwoSide, LazyCom, Loading } from "../../components"
import "./style.less"
import { musicStore } from "../../store"
import { request } from "../../request"

const Main = ({ contents, audio }: { contents: string[]; audio: audio }) => (
  <>
    <h1 className="About-Main-Title">魂魄妖梦al</h1>
    <div className="About-Main-Content">
      <ul>
        {contents.map(a => (
          <li key={a}>
            <p>{a}</p>
          </li>
        ))}
      </ul>
      {audio.info}
      <Audio
        src={audio.src}
        autoplay={musicStore.getState().music}
        start={musicStore.getState().musicCurrent}
        onChange={(statu, audio) => {
          musicStore.dispatch("music", statu === "playing")
          musicStore.dispatch("musicCurrent", audio.currentTime)
        }}
      />
    </div>
  </>
)

type audio = {
  info: string
  src: string
  name: string
}

export interface About {
  contents: string[]
  audio: audio
  projects: Array<{ name: string; href: string; content: string }>
}

export const About = ({ contents, audio, projects }: About) => (
  <div className="About">
    <TwoSide>
      <section className="About-Main">
        <Main contents={contents} audio={audio} />
      </section>
      <aside className="About-Aside">
        <h2 className="About-Aside-Title">Projects</h2>
        <ul className="About-Aside-Content">
          {projects.map(({ name, href, content }) => (
            <li key={name} className="About-Aside-Content-Proj">
              <a href={href}>{name}</a>
              <p>{content}</p>
            </li>
          ))}
        </ul>
      </aside>
    </TwoSide>
  </div>
)

export const AboutLazy = () => (
  <LazyCom await={request("about")} fallback={<Loading />}>
    {JAbout => <About {...JAbout} />}
  </LazyCom>
)
