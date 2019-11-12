import React, { useMemo, useEffect } from "react"
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
  NotFound,
  SearchResult
} from "./pages"
import { SearchInput, MusicLine, PreImg, Themer, Uv } from "./components"

import { getHash, queryRootFirstChildMemo } from "./utils"
import { useShowBar, useEvent, useBlogMenu } from "./hooks"
import { API } from "./request"
import { Icon } from "./iconfont"
import { Routes as RS } from "./config"

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
  const firstBlog = queryRootFirstChildMemo(blogTree)

  const show = useShowBar()
  const expand = useBlogMenu(blogTree)

  const title = useMemo(() => document.title, [])
  const setTitle = () => {
    const hash = getHash()
    hash.startsWith(blogTree.path) && expand(hash)
    document.title =
      hash
        .split("/")
        .pop()
        .split("?")[0] || title
  }
  useEvent("hashchange", setTitle)
  useEffect(setTitle, [])

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
                <span className="nav-start-name">{RS.home.name}</span>
              </AppNavLink>
            </li>
            <li>
              <AppNavLink to={RS.acts.href}>{RS.acts.name}</AppNavLink>
            </li>
            <li>
              <AppNavLink
                to={firstBlog.path}
                isActive={(_, ctxPath) => ctxPath.startsWith(blogTree.path)}
              >
                {RS.blog.name}
              </AppNavLink>
            </li>
            <li>
              <AppNavLink to={RS.learn.href}>{RS.learn.name}</AppNavLink>
            </li>
            <li>
              <AppNavLink to={RS.about.href}>{RS.about.name}</AppNavLink>
            </li>
            <li>
              <AppNavLink to={RS.links.href}>{RS.links.name}</AppNavLink>
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
          <Route exact path={RS.home.href} component={() => <HomeLazy />} />
          <Route
            path={RS.blog.href}
            component={() => <Blog tree={blogTree} />}
          />
          <Route
            path={RS.about.href}
            component={() => <About {...aboutInfo} />}
          />
          <Route path={RS.links.href} component={() => <LinksLazy />} />
          <Route path={RS.secret.href} component={() => <Secret />} />
          <Route path={RS.acts.href} component={() => <ActivityLazy />} />
          <Route path={RS.learn.href} component={() => <LearnLazy />} />
          <Route path={RS.search.href} component={() => <SearchResult />} />
          <Route path={RS.notFound.href} component={() => <NotFound />} />
        </Switch>
      </main>
      <footer className="footer">
        Copyright © 2019 saber2pr
        <Uv />
      </footer>
    </Router>
  )
}

export default App
