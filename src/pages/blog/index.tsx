import React, { useRef, useLayoutEffect } from "react"
import { Route, Link, Switch, NavLink } from "@saber2pr/react-router"
import Tree from "@saber2pr/rc-tree"

import MD from "@saber2pr/md2jsx"

import "./style.less"

import { TwoSide, Loading, LazyCom, AniBtn } from "../../components"
import { useIsMobile, useAniLayout } from "../../hooks"

import { md_theme, origin } from "../../config"
import {
  timeDeltaFromNow,
  findNodeByPath,
  queryRootFirstChildMemo,
  collect,
  TextTree
} from "../../utils"
import { API, requestContent } from "../../request"
import { store } from "../../store"
import { NotFound } from "../not-found"

const BLink = (props: Link) => (
  <NavLink activeClassName="Blog-A-Active" className="Blog-A" {...props} />
)

const LoadingBlock = () => (
  <div className="Blog-Main-Content-Loading">
    <Loading />
  </div>
)

export interface Blog {
  tree: TextTree
}

const createOriginHref = (href: string) =>
  API.createBlobHref(origin.userId, origin.repo, href + ".md")

export const Blog = ({ tree }: Blog) => {
  const firstBlog = queryRootFirstChildMemo(tree)
  const links = collect(tree)

  const isOpen = useRef(false)
  const aniBtnRef = useRef<{ close: Function }>()
  const [ref, open, close] = useAniLayout()
  const isMobile = useIsMobile(close, open)

  const getLastModified = (href: string): string =>
    findNodeByPath(href, tree)["LastModified"]

  useLayoutEffect(() => {
    window.scroll(0, 0)
    ref.current.scrollTop = store.getState().blogScrollTop
    return () => {
      store.getState().blogScrollTop = ref.current.scrollTop
    }
  }, [])

  const Routes = links.reduce(
    (acc, { title, path: href, children }) => {
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
                    fallback={<LoadingBlock />}
                    await={requestContent(href + ".md")}
                  >
                    {content => <MD theme={md_theme}>{content}</MD>}
                  </LazyCom>
                  <div className="Blog-Main-Content-Edit">
                    <a
                      className="Blog-Main-Content-Edit-A"
                      href={createOriginHref(href)}
                    >
                      编辑本页面
                    </a>
                  </div>
                  <p className="Blog-Main-Content-Date">
                    最近更新 {timeDeltaFromNow(getLastModified(href))}
                  </p>
                </div>
              </>
            )}
          />
        )
      }
      return acc
    },
    [] as JSX.Element[]
  )

  return (
    <div className="Blog">
      <TwoSide>
        <main className="Blog-Main">
          <Switch>
            {[
              ...Routes,
              <Route key="not-found" path="*" component={() => <NotFound />} />
            ]}
          </Switch>
        </main>
        <aside className="Blog-Aside" ref={ref}>
          <section className="Blog-Aside-Content">
            <Tree
              from={tree}
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
    </div>
  )
}
