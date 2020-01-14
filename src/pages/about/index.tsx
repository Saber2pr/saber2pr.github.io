import React, { memo } from "react"

import {
  TwoSide,
  LazyCom,
  Loading,
  useModel,
  checkUpdate,
  cleanUpdates,
  setUpdateOmit,
  getUpdateOmit
} from "../../components"
import "./style.less"
import { request } from "../../request"
import { getVersion } from "../../utils"
import { useBtnDisable } from "../../hooks"

const useOption = (): [JSX.Element, (show?: boolean) => void] => {
  const clearCache = () => {
    show(false)
    cleanUpdates()
  }

  const [ref, disable] = useBtnDisable()

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
          <button
            className="ButtonHigh"
            ref={ref}
            onClick={() => {
              disable()
              const updateOmit = getUpdateOmit()
              setUpdateOmit("false")
              checkUpdate(() => {
                disable(false)
                setUpdateOmit(updateOmit)
              })
            }}
          >
            检查更新
          </button>
        </dd>
        <dd>
          <button className="ButtonHigh" onClick={clearCache}>
            清除缓存
          </button>
        </dd>
        <dd>
          <div className="Option-Version">版本号：v{getVersion()}</div>
        </dd>
      </dl>
    </>
  )
  return [model, show]
}

const Main = ({ contents }: { contents: string[] }) => {
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

export interface About {
  contents: string[]
  projects: Array<{ name: string; href: string; content: string }>
}

export const About = ({ contents, projects }: About) => (
  <div className="About">
    <TwoSide>
      <section className="About-Main">
        <Main contents={contents} />
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
