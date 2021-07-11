import './app.less'

import React, { useEffect, useMemo } from 'react'

import {
  HashHistory,
  NavLink,
  Route,
  Router,
  Switch,
} from '@saber2pr/react-router'

import { pushIV } from './api/pushIV'
import { createMusicBox, PreImg, SearchInput, Themer, Uv } from './components'
import { HeaderMessage } from './components/header-message'
import { origin, Routes as RS } from './config'
import { useBlogMenu, useEvent, useFullWindow, useIsMob } from './hooks'
import { useShowMusic } from './hooks/useShowMusic'
import { Icon } from './iconfont'
import {
  About,
  AcgLazy,
  ActivityLazy,
  Blog,
  Datav,
  Home,
  LearnLazy,
  LinksLazy,
  NotFound,
  PageV,
  SearchResult,
  Secret,
} from './pages'
import { getHash, queryRootFirstChildMemo } from './utils'

export interface App {
  homeInfo: Home
  blogTree: Blog['tree']
  aboutInfo: About
}

const AppNavLink = ({
  className = 'nav-a',
  activeClassName = 'nav-a-active',
  ...props
}: NavLink) => (
  <NavLink className={className} activeClassName={activeClassName} {...props} />
)

export const App = ({ homeInfo, aboutInfo, blogTree }: App) => {
  const firstBlog = queryRootFirstChildMemo(blogTree)
  const expand = useBlogMenu(blogTree)

  const isMob = useIsMob()

  const title = useMemo(() => document.title, [])
  const setTitle = () => {
    const hash = getHash()
    hash.startsWith(blogTree.path) && expand(hash)
    const currentTitle = hash.split('/').pop().split('?')[0] || title
    if (currentTitle === origin.title) {
      document.title = `${currentTitle}`
    } else {
      document.title = `${currentTitle} - ${origin.title}`
    }
    pushIV({
      type: '页面访问',
      payload: currentTitle,
    })
  }
  useEvent('hashchange', setTitle)
  useEffect(setTitle, [])

  const [header_ref, main_ref, footer_ref, btn_ref, fullWinBtnAPI] =
    useFullWindow({
      enableClassName: 'FullWinBtn iconfont icon-fullwin-enable',
      disableClassName: 'FullWinBtn iconfont icon-fullwin-disable',
    })

  const showMusic = useShowMusic()

  return (
    <Router history={HashHistory}>
      <header ref={header_ref}>
        <nav className="nav">
          <ul className="nav-ul">
            <li>
              <AppNavLink className="nav-start" to="/">
                <PreImg
                  className="nav-start-img"
                  fallback={<Icon.Head />}
                  src={homeInfo.pic}
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
            {isMob || (
              <li>
                <AppNavLink to={RS.datav.href}>{RS.datav.name}</AppNavLink>
              </li>
            )}
            <li>
              <AppNavLink to={RS.about.href}>{RS.about.name}</AppNavLink>
            </li>
            <li>
              <AppNavLink to={RS.links.href}>{RS.links.name}</AppNavLink>
            </li>
            <li className="nav-block">
              <HeaderMessage />
            </li>
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
        <picture className="main-bg" />
        {showMusic && (
          <i
            className="iconfont icon-musicBox"
            onClick={createMusicBox}
            title="音乐盒子"
          />
        )}
        <Switch>
          <Route
            exact
            path={RS.home.href}
            component={() => <Home {...homeInfo} />}
          />
          <Route
            path={RS.blog.href}
            component={() => (
              <Blog
                ref={btn_ref}
                fullWinBtnAPI={fullWinBtnAPI}
                tree={blogTree}
                showOp={{
                  latest: true,
                  musicBox: false,
                }}
              />
            )}
          />
          <Route
            path={RS.about.href}
            component={() => <About {...aboutInfo} />}
          />
          <Route path={RS.links.href} component={() => <LinksLazy />} />
          <Route path={RS.secret.href} component={() => <Secret />} />
          <Route path={RS.v.href} component={() => <PageV />} />
          <Route path={RS.acts.href} component={() => <ActivityLazy />} />
          <Route path={RS.learn.href} component={() => <LearnLazy />} />
          <Route path={RS.search.href} component={() => <SearchResult />} />
          <Route path={RS.acg.href} component={() => <AcgLazy />} />
          <Route
            path={RS.datav.href}
            component={() => <Datav data={blogTree} />}
          />
          <Route path={RS.notFound.href} component={() => <NotFound />} />
        </Switch>
      </main>
      <footer ref={footer_ref} className="footer">
        <span className="footer-info">
          Copyright © 2019-{new Date().getFullYear()} saber2pr
          <Uv />
        </span>
      </footer>
    </Router>
  )
}

export default App
