import React from "react"
import {
  Router,
  Route,
  HashHistory,
  Switch,
  NavLink
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
import { SearchInput, MusicLine, PreImg, Themer } from "./components"

import { store } from "./store"
import { getHash, queryRootFirstChild } from "./utils"
import { useShowBar, useEvent } from "./hooks"
import { API } from "./request"
import { Icon } from "./iconfont"
import { useBlogMenu } from "./hooks/useBlogMenu"

export interface App {
  JBlog: Blog["tree"]
  JAbout: About
}

const AppNavLink = ({
  className = "header-a",
  activeClassName = "header-a-active",
  ...props
}: NavLink) => (
  <NavLink className={className} activeClassName={activeClassName} {...props} />
)

export const App = ({ JAbout, JBlog }: App) => {
  const firstBlog = queryRootFirstChild(JBlog)
  store.getState().blogRoot = firstBlog.path

  const show = useShowBar()
  const expand = useBlogMenu(JBlog)
  useEvent(
    "hashchange",
    () => getHash().startsWith(JBlog.path) && expand(getHash())
  )

  return (
    <>
      {show && <MusicLine src={JAbout.audio.src} name={JAbout.audio.name} />}
      <main className="main">
        <div className="main-bg" />
        <Router history={HashHistory}>
          <nav className="header">
            <AppNavLink className="header-start" to="/">
              <PreImg
                className="header-start-img"
                fallback={<Icon.Head />}
                src={API.createAvatars("saber2pr")}
              />
              <span className="header-start-name">saber2pr</span>
            </AppNavLink>
            <span className="header-links">
              <AppNavLink to="/activity">动态</AppNavLink>
              <AppNavLink
                to={firstBlog.path}
                isActive={(_, ctxPath) => ctxPath.startsWith(JBlog.path)}
              >
                博客
              </AppNavLink>
              <AppNavLink to="/learn">文档</AppNavLink>
              <AppNavLink to="/about">关于</AppNavLink>
              <AppNavLink to="/links">链接</AppNavLink>
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
