import React, { useMemo, useEffect } from "react"
import ReactDOM from "react-dom"

import "normalize.css"

import "animate.css/source/flippers/flipInX.css"

import "./style/animation.less"
import "./style/shadow.less"
import "./style/components.less"

// /

import {
  Router,
  Route,
  HashHistory,
  Switch,
  NavLink
} from "@saber2pr/react-router"

import "./app.less"
import { Blog, NotFound, SearchResult } from "./pages"
import { SearchInput, Themer, Uv, ErrorBoundary, Loading } from "./components"

import {
  getHash,
  queryRootFirstChildMemo,
  welcome,
  parseTree,
  whenInDEV
} from "./utils"
import { useEvent, useBlogMenu, useFullWindow } from "./hooks"
import { Routes as RS, origin } from "./config"
import { request } from "./request"

export interface App {
  blogTree: Blog["tree"]
}

const AppNavLink = ({
  className = "nav-a",
  activeClassName = "nav-a-active",
  ...props
}: NavLink) => (
  <NavLink className={className} activeClassName={activeClassName} {...props} />
)

export const App = ({ blogTree }: App) => {
  const firstBlog = queryRootFirstChildMemo(blogTree)
  const expand = useBlogMenu(blogTree)

  const title = useMemo(() => document.title, [])

  const setTitle = () => {
    const hash = getHash()

    if (hash === "/") {
      location.hash = "#" + firstBlog.path
    }

    hash.startsWith(blogTree.path) && expand(hash)
    document.title =
      hash
        .split("/")
        .pop()
        .split("?")[0] || title
  }
  useEvent("hashchange", setTitle)
  useEffect(setTitle, [])

  const [
    header_ref,
    main_ref,
    footer_ref,
    btn_ref,
    fullWinBtnAPI
  ] = useFullWindow({
    enableClassName: "FullWinBtn iconfont icon-fullwin-enable",
    disableClassName: "FullWinBtn iconfont icon-fullwin-disable"
  })

  return (
    <Router history={HashHistory}>
      <header ref={header_ref}>
        <nav className="nav">
          <ul className="nav-ul">
            <li>
              <AppNavLink to={firstBlog.path}>{firstBlog.title}</AppNavLink>
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
      <main ref={main_ref} className="main">
        <Switch>
          <Route
            path={RS.blog.href}
            component={() => (
              <Blog
                ref={btn_ref}
                fullWinBtnAPI={fullWinBtnAPI}
                tree={blogTree}
                showLatest={false}
              />
            )}
          />
          <Route path={RS.search.href} component={() => <SearchResult />} />
          <Route path={RS.notFound.href} component={() => <NotFound />} />
        </Switch>
      </main>
      <footer ref={footer_ref} className="footer">
        <span className="footer-info">
          Copyright © 2019 saber2pr
          <Uv />
        </span>
      </footer>
    </Router>
  )
}

declare const LOADING: { destroy: Function }

const Wiki = React.lazy(async () => {
  welcome()
  const blogTree = parseTree(await request("wiki"))
  LOADING.destroy()
  return {
    default: () => <App blogTree={blogTree} />
  }
})

const createWiki = (repo: string) => {
  origin.repo = repo
  ReactDOM.render(
    <ErrorBoundary>
      <React.Suspense fallback={<Loading />}>
        <Wiki />
      </React.Suspense>
    </ErrorBoundary>,
    document.getElementById("root")
  )
}

if (whenInDEV()) {
  createWiki("./")
} else {
  createWiki(location.pathname.replace(/\//g, ""))
}
