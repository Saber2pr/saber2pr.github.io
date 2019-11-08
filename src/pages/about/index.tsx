declare const version: string

import React from "react"
import Audio from "@saber2pr/rc-audio"

import { TwoSide, LazyCom, Loading } from "../../components"
import { useIsMob } from "../../hooks"
import "./style.less"
import { musicStore } from "../../store"
import { request } from "../../request"

const Foot = () => (
  <>
    <p className="About-Main-Repo">
      <a href="//github.com/Saber2pr/saber2pr.github.io">saber2pr.github.io</a>
    </p>
    <p className="About-Main-Repo">{version}</p>
    <p className="About-Main-Repo">
      <script
        async
        src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
      />
      <span id="busuanzi_container_site_uv">
        本站访客数
        <span id="busuanzi_value_site_uv" />
        人次
      </span>
    </p>
  </>
)

const Main = ({ contents, audio }: { contents: string[]; audio: audio }) => {
  return (
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
}

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

export const About = ({ contents, audio, projects }: About) => {
  const isMob = useIsMob()
  return (
    <div className="About">
      <TwoSide>
        <section className="About-Main">
          <Main contents={contents} audio={audio} />
          {isMob || <Foot />}
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
          {isMob && <Foot />}
        </aside>
      </TwoSide>
    </div>
  )
}

export const AboutLazy = () => (
  <LazyCom await={request("about")} fallback={<Loading />}>
    {JAbout => <About {...JAbout} />}
  </LazyCom>
)
