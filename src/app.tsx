import React, { useEffect } from "react"
import {
  Router,
  Route,
  Link,
  HashHistory,
  Switch
} from "@saber2pr/react-router"

import "./app.less"
import {
  Blog,
  About,
  Secret,
  HomeLazy,
  LinksLazy,
  ActivityLazy,
  LearnLazy,
  NotFound
} from "./pages"
import { ALink, SearchInput, MusicLine, PreImg, Themer } from "./components"

import { store } from "./store"
import { getHash, queryRootFirstChild } from "./utils"
import { useShowBar, useEvent } from "./hooks"
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
  store.getState().blogRoot = firstBlog.path
  useEffect(() => {
    store.dispatch("href", hash)
  }, [])
  useEvent("popstate", () => store.dispatch("href", getHash()), [])

  const show = useShowBar()
  return (
    <>
      {show && <MusicLine src={JAbout.audio.src} name={JAbout.audio.name} />}
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
          <Switch>
            <Route exact path="/" component={() => <HomeLazy />} />
            <Route path="/blog" component={() => <Blog tree={JBlog} />} />
            <Route path="/about" component={() => <About {...JAbout} />} />
            <Route path="/links" component={() => <LinksLazy />} />
            <Route path="/secret" component={() => <Secret />} />
            <Route path="/activity" component={() => <ActivityLazy />} />
            <Route path="/learn" component={() => <LearnLazy />} />
            <Route path="*" component={() => <NotFound />} />
          </Switch>
        </Router>
      </main>
    </>
  )
}

export default App
