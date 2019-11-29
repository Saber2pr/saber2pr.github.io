import React, { memo } from "react"
import Audio from "@saber2pr/rc-audio"

import { TwoSide, LazyCom, Loading, useModel, Model } from "../../components"
import "./style.less"
import { musicStore } from "../../store"
import { request } from "../../request"
import { freeCache, getVersion } from "../../utils"

const useOption = (): [JSX.Element, (show?: boolean) => void] => {
  const clearCache = () => {
    show(false)
    freeCache().then(() =>
      Model.alert(({ close }) => {
        setTimeout(close, 1000)
        return (
          <p className="About-Alert-Message" onClick={close}>
            清除成功
          </p>
        )
      })
    )
  }

  const [model, show] = useModel(
    <>
      <div className="Option-Close" onClick={() => show(false)}>
        <div />
        <div />
      </div>
      <dl className="About-Option">
        <dt>
          <div className="Option-Title">选项</div>
        </dt>
        <dd>
          <button className="ButtonHigh" onClick={clearCache}>
            清除缓存
          </button>
        </dd>
        <dd>
          <div className="Option-Version">版本号：{getVersion()}</div>
        </dd>
      </dl>
    </>
  )
  return [model, show]
}

const Main = ({ contents, audio }: { contents: string[]; audio: audio }) => {
  const [model, show] = useOption()
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
        <hr className="About-Hr" />
        <div>
          {model}
          <button className="ButtonHigh" onClick={() => show()}>
            附加选项
          </button>
        </div>
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

export const AboutLazy = memo(() => (
  <LazyCom await={request("about")} fallback={<Loading type="block" />}>
    {res => <About {...res} />}
  </LazyCom>
))
