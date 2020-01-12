import React, { memo } from "react"

import { TwoSide, LazyCom, Loading, useModel, Model } from "../../components"
import "./style.less"
import { request } from "../../request"
import { freeCache, getVersion } from "../../utils"
import { origin } from "../../config"

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
          <button
            className="ButtonHigh"
            onClick={() => {
              fetch(origin.data.version)
                .then(res => res.json())
                .then(({ version: ver }) => {
                  if (ver === getVersion()) {
                    Model.alert(({ close }) => {
                      setTimeout(close, 1000)
                      return (
                        <p className="About-Alert-Message" onClick={close}>
                          已经是最新版
                        </p>
                      )
                    })
                  } else {
                    Model.alert(({ close }) => (
                      <div className="About-Alert-Message">
                        <div className="Option-Title">
                          有新的版本(v{ver})，是否立即更新？
                        </div>
                        <button
                          className="ButtonHigh"
                          onClick={() =>
                            freeCache().then(() => location.reload())
                          }
                        >
                          确定
                        </button>
                        <button className="ButtonHigh" onClick={close}>
                          取消
                        </button>
                      </div>
                    ))
                  }
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
