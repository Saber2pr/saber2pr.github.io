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
import { useShowBar, useEvent, useBlogMenu, useValue } from "./hooks"
import { API } from "./request"
import { Icon } from "./iconfont"

export interface App {
  blogTree: Blog["tree"]
  aboutInfo: About
}

const AppNavLink = ({
  className = "nav-a",
  activeClassName = "nav-a-active",
  ...props
}: NavLink) => (
  <NavLink className={className} activeClassName={activeClassName} {...props} />
)

export const App = ({ aboutInfo, blogTree }: App) => {
  const firstBlog = queryRootFirstChild(blogTree)
  store.getState().blogRoot = firstBlog.path

  const show = useShowBar()
  const expand = useBlogMenu(blogTree)

  const val = useValue(() => document.title)

  useEvent("hashchange", () => {
    const hash = getHash()
    hash.startsWith(blogTree.path) && expand(hash)
    document.title = hash.split("/").pop() || val
  })

  return (
    <Router history={HashHistory}>
      <header>
        <nav className="nav">
          <ul className="nav-ul">
            <li>
              <AppNavLink className="nav-start" to="/">
                <PreImg
                  className="nav-start-img"
                  fallback={<Icon.Head />}
                  src={API.createAvatars("saber2pr")}
                />
                <span className="nav-start-name">saber2pr</span>
              </AppNavLink>
            </li>
            <li>
              <AppNavLink to="/动态">动态</AppNavLink>
            </li>
            <li>
              <AppNavLink
                to={firstBlog.path}
                isActive={(_, ctxPath) => ctxPath.startsWith(blogTree.path)}
              >
                博客
              </AppNavLink>
            </li>
            <li>
              <AppNavLink to="/文档">文档</AppNavLink>
            </li>
            <li>
              <AppNavLink to="/关于">关于</AppNavLink>
            </li>
            <li>
              <AppNavLink to="/链接">链接</AppNavLink>
            </li>
            <li className="nav-block" />
            <li>
              <SearchInput blog={blogTree} />
            </li>
            <li className="nav-last">
              <a href="https://github.com/Saber2pr">GitHub</a>
            </li>
            <li className="nav-tool">
              <Themer />
            </li>
          </ul>
        </nav>
      </header>
      {show && (
        <MusicLine src={aboutInfo.audio.src} name={aboutInfo.audio.name} />
      )}
      <main className="main">
        <picture className="main-bg" />
        <Switch>
          <Route exact path="/" component={() => <HomeLazy />} />
          <Route path="/blog" component={() => <Blog tree={blogTree} />} />
          <Route path="/关于" component={() => <About {...aboutInfo} />} />
          <Route path="/链接" component={() => <LinksLazy />} />
          <Route path="/secret" component={() => <Secret />} />
          <Route path="/动态" component={() => <ActivityLazy />} />
          <Route path="/文档" component={() => <LearnLazy />} />
          <Route path="*" component={() => <NotFound />} />
        </Switch>
      </main>
      <footer className="footer">
        Copyright © 2019 saber2pr
        <UV />
      </footer>
    </Router>
  )
}

const UV = () => (
  <div className="footer-uv">
    <span id="busuanzi_container_site_uv">
      uv:
      <span id="busuanzi_value_site_uv" />
    </span>
  </div>
)

export default App
