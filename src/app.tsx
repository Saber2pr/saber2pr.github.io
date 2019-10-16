import React, { useEffect } from "react"
import { Router, Route, Link, HashHistory } from "@saber2pr/react-router"

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
import { getHash, queryRootFirstChild } from "./utils"
import { useShowBar } from "./hooks"
import { API } from "./request"
import { Icon } from "./iconfont"

const HLink = (props: Link) => (
  <ALink {...props} act="header-a-active" uact="header-a" />
)

const HNLink = (props: Link) => (
  <Link {...props} onClick={() => store.dispatch("href", "")} />
)

export interface App {
  JBlog: Blog["tree"]
  JAbout: About
}

export const App = ({ JAbout, JBlog }: App) => {
  const hash = getHash()
  const firstBlog = queryRootFirstChild(JBlog)
  store.dispatch("blogRoot", firstBlog.path)
  useEffect(() => {
    store.dispatch("href", hash)
    const onpopstate = () => store.dispatch("href", getHash())
    window.addEventListener("popstate", onpopstate)
    return () => window.removeEventListener("popstate", onpopstate)
  }, [])

  // const show = useShowBar()
  return (
    <>
      {/* {show && <MusicLine src={JAbout.audio.src} name={JAbout.audio.name} />} */}
      <main className="main">
        <div className="main-bg" />
        <Router history={HashHistory}>
          <nav className="header">
            <HNLink className="header-start" to="/">
              <PreImg
                className="header-start-img"
                fallback={<Icon.Head />}
                src={API.createAvatars("saber2pr")}
              />
              <span className="header-start-name">saber2pr</span>
            </HNLink>
            <span className="header-links">
              <HLink to="/activity">动态</HLink>
              <HLink to={firstBlog.path}>博客</HLink>
              <HLink to="/learn">文档</HLink>
              <HLink to="/about">关于</HLink>
              <HLink to="/links">链接</HLink>
            </span>
            <SearchInput blog={JBlog} />
            <a className="header-last" href="https://github.com/Saber2pr">
              GitHub
            </a>
            <span className="header-tool">
              <Themer />
            </span>
          </nav>
          <Route exact path="/" component={() => <HomeLazy />} />
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
