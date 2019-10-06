import React, { useEffect } from "react"
import { Router, Route, Link, LinkProps, usePush } from "@saber2pr/router"

import "./app.less"
import { Home, Blog, About, Links, Secret, Activity, Learn } from "./pages"
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
  JHome: Home
  JBlog: Blog["tree"]
  JAbout: About["about"]
  JProject: About["projects"]
  JLinks: Links
  JActs: Activity["acts"]
  JSites: Learn["sites"]
}

export const App = ({
  JAbout,
  JBlog,
  JHome,
  JLinks,
  JProject,
  JActs,
  JSites
}: App) => {
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
          <Route path="/home" component={() => <Home {...JHome} />} />
          <Route path="/blog" component={() => <Blog tree={JBlog} />} />
          <Route
            path="/about"
            component={() => <About about={JAbout} projects={JProject} />}
          />
          <Route path="/links" component={() => <Links {...JLinks} />} />
          <Route path="/secret" component={() => <Secret />} />
          <Route path="/activity" component={() => <Activity acts={JActs} />} />
          <Route path="/learn" component={() => <Learn sites={JSites} />} />
        </Router>
      </main>
    </>
  )
}

export default App
