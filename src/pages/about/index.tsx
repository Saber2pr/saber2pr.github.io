import './style.less'

import React, { memo } from 'react'

import { LazyCom, Loading, TwoSide, useOption } from '../../components'
import { request } from '../../request'

const Main = ({ contents }: { contents: string[] }) => {
  const [model, show] = useOption()
  return (
    <>
      <h1 className="About-Main-Title">About Me</h1>
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
  <LazyCom await={request('about')} fallback={<Loading type="block" />}>
    {res => <About {...res} />}
  </LazyCom>
))
