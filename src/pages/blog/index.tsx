import './style.less'

import React, { useLayoutEffect, useRef } from 'react'

import Tree from '@saber2pr/rc-tree'
import { Link, NavLink, Route, Switch } from '@saber2pr/react-router'

import {
  AniBtn,
  createMusicBox,
  ErrorBack,
  LazyCom,
  Loading,
  NextBefore,
  ScrollToTop,
  status,
  TwoSide,
} from '../../components'
import { Md2jsx, md_theme, origin } from '../../config'
import {
  fullWinBtnAPI,
  useAniLayout,
  useAsideHidable,
  useIsMobile,
} from '../../hooks'
import { Icon } from '../../iconfont'
import { API, requestContent } from '../../request'
import { store } from '../../store'
import {
  collect,
  findNodeByPath,
  queryRootFirstChildMemo,
  TextTree,
  timeDeltaFromNow,
} from '../../utils'
import { NotFound } from '../not-found'

const BLink = (props: Link) => (
  <NavLink activeClassName="Blog-A-Active" className="Blog-A" {...props} />
)

export interface Blog {
  tree: TextTree
  fullWinBtnAPI: fullWinBtnAPI
  showOp?: {
    latest?: boolean
    musicBox?: boolean
  }
}

const createOriginHref = (href: string) =>
  API.createBlobHref(origin.userId, origin.repo, href + '.md')

export const getParentPath = (path: string) => {
  if (path) {
    const names = path.split('/')
    names.pop()
    return names.join('/')
  }
}

export const Blog = React.forwardRef<HTMLElement, Blog>(
  (
    {
      tree,
      fullWinBtnAPI: { select, selectProps, re: isFullWin },
      showOp = { latest: true, musicBox: true },
    }: Blog,
    fullwinBtn_ref
  ) => {
    const firstBlog = queryRootFirstChildMemo(tree)
    const links = collect(tree)

    const isOpen = useRef(false)
    const aniBtnRef = useRef<{ close: Function }>()
    const [ref, open, close] = useAniLayout()
    const isMobile = useIsMobile(close, open)

    const getLastModified = (href: string): string =>
      findNodeByPath(href, tree)['LastModified']

    useLayoutEffect(() => {
      window.scroll(0, 0)
      ref.current.scrollTop = store.getState().blogScrollTop
      return () => {
        store.getState().blogScrollTop = ref.current.scrollTop
      }
    }, [])

    const Routes = links.reduce((acc, { title, path: href, children }, i) => {
      if (!children) {
        acc.push(
          <Route
            key={href}
            path={href}
            component={() => (
              <>
                <h1 className="Blog-Main-Title">{title}</h1>
                <div className="Blog-Main-Content">
                  <LazyCom
                    fallback={<Loading type="line" />}
                    await={requestContent(href + '.md')}
                    errorBack={<ErrorBack />}
                  >
                    {content => <Md2jsx theme={md_theme}>{content}</Md2jsx>}
                  </LazyCom>
                  <div className="Blog-Main-Content-Edit">
                    <a
                      className="Blog-Main-Content-Edit-A"
                      href={createOriginHref(href)}
                    >
                      编辑本页面
                    </a>
                    {firstBlog?.path === href || (
                      <a
                        className="Blog-Main-Content-Edit-A"
                        target="_blank"
                        href={API.createNewHref(
                          origin.userId,
                          origin.repo,
                          getParentPath(href)
                        )}
                      >
                        新建文章
                      </a>
                    )}
                  </div>
                  {showOp.latest && (
                    <p className="Blog-Main-Content-Date">
                      最近更新 {timeDeltaFromNow(getLastModified(href))}
                    </p>
                  )}
                  <NextBefore before={links[i - 1]} next={links[i + 1]} />
                </div>
              </>
            )}
          />
        )
      }
      return acc
    }, [] as JSX.Element[])

    const [main_ref, btn_ref, switchIsHide, isShow] = useAsideHidable(ref)
    return (
      <div className="Blog">
        <TwoSide>
          <main className="Blog-Main" ref={main_ref}>
            <Switch>
              {[
                ...Routes,
                <Route
                  key="not-found"
                  path="*"
                  component={() => <NotFound />}
                />,
              ]}
            </Switch>
          </main>
          <aside className="Blog-Aside" ref={ref}>
            <div
              ref={btn_ref}
              className="Blog-Aside-Btn"
              onClick={() => switchIsHide()}
            >
              {Icon.TreeBtn(isShow, '-90deg', '90deg', 'rotate')}
            </div>
            <section className="Blog-Aside-Content">
              <Tree
                from={tree}
                selectBtn={Icon.TreeBtn}
                map={({ path: href, title, children }) => {
                  if (href === firstBlog.path) return <></>
                  if (children) return <span>{title}</span>
                  return (
                    <BLink
                      to={href}
                      onClick={() => {
                        if (!isMobile()) return
                        isOpen.current = close(false)
                        aniBtnRef.current.close()
                      }}
                    >
                      {title}
                    </BLink>
                  )
                }}
              />
            </section>
          </aside>
        </TwoSide>
        <AniBtn
          ref={aniBtnRef}
          onClick={() => {
            isOpen.current = isOpen.current ? close() : open()
          }}
        />
        {isShow || <ScrollToTop />}
        {!showOp.musicBox || !status.show || (
          <i
            className="iconfont icon-musicBox"
            onClick={createMusicBox}
            title="音乐盒子"
          />
        )}
        {
          <i
            {...selectProps()}
            ref={fullwinBtn_ref}
            onClick={() => {
              select()
              if (isFullWin.current) {
                switchIsHide(true)
              } else {
                switchIsHide(false)
              }
            }}
          />
        }
      </div>
    )
  }
)
