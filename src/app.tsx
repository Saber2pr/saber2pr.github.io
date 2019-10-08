import React, { useEffect } from "react"
import { Router, Route, Link, LinkProps, usePush } from "@saber2pr/router"

import "./app.less"
import {
  Blog,
  About,
  Secret,
  HomeLazy,
  AboutLazy,
  LinksLazy,
  ActivityLazy,
  LearnLazy
} from "./pages"
import { ALink, SearchInput, MusicLine, PreImg, Themer } from "./components"

import { store } from "./store"
import { history } from "./config"
import { getHash } from "./utils"
import { useShowBar } from "./hooks"
import { API } from "./request"
import { Icon } from "./iconfont"

const HLink = (props: Omit<ALink, "act" | "uact">) => (
  <ALink {...props} act="header-a-active" uact="header-a" />
)

const HNLink = (props: LinkProps) => (
  <Link {...props} onClick={() => store.dispatch("href", "")} />
)

export interface App {
  JBlog: Blog["tree"]
  JAbout: About
}

export const App = ({ JAbout, JBlog }: App) => {
  const [push] = usePush()
  const hash = getHash()
  useEffect(() => {
    if (hash) {
      push(hash)
    } else {
      push("/home")
    }
  })

  const onhashchange = () => store.dispatch("href", getHash())
  useEffect(() => {
    window.addEventListener("hashchange", onhashchange)
    return () => window.removeEventListener("hashchange", onhashchange)
  })

  const show = useShowBar()
  return (
    <>
      <nav className="header">
        <HNLink className="header-start" to="/home">
          <PreImg
            className="header-start-img"
            fallback={<Icon.Head />}
            src={API.createAvatars("saber2pr")}
          />
          <span className="header-start-name">saber2pr</span>
        </HNLink>
        <span className="header-links">
          <HLink to="/activity" scrollReset>
            动态
          </HLink>
          <HLink to="/blog">博客</HLink>
          <HLink to="/learn" scrollReset>
            文档
          </HLink>
          <HLink to="/about" scrollReset>
            关于
          </HLink>
          <HLink to="/links" scrollReset>
            链接
          </HLink>
        </span>
        <SearchInput blog={JBlog} />
        <a className="header-last" href="https://github.com/Saber2pr">
          GitHub
        </a>
        <span className="header-tool">
          <Themer />
        </span>
      </nav>
      {show && <MusicLine src={JAbout.audio.src} name={JAbout.audio.name} />}
      <main className="main">
        <div className="main-bg" />
        <Router history={history}>
          <Route path="/home" component={() => <HomeLazy />} />
          <Route path="/blog" component={() => <Blog tree={JBlog} />} />
          <Route path="/about" component={() => <AboutLazy />} />
          <Route path="/links" component={() => <LinksLazy />} />
          <Route path="/secret" component={() => <Secret />} />
          <Route path="/activity" component={() => <ActivityLazy />} />
          <Route path="/learn" component={() => <LearnLazy />} />
        </Router>
      </main>
    </>
  )
}

export default App
