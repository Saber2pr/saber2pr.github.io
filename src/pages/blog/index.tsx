import React, { useRef, useEffect } from "react"
import { Route, Link, Switch } from "@saber2pr/react-router"
import Tree from "@saber2pr/rc-tree"

import MD from "@saber2pr/md2jsx"

import "./style.less"
import { Icon } from "../../iconfont"

import { TwoSide, ALink, Loading, LazyCom } from "../../components"
import { useIsMobile } from "../../hooks"

import { md_theme, origin } from "../../config"
import { collect, TextTree } from "../../utils/collect"
import { timeDeltaFromNow, getHash, findNodeByPath } from "../../utils"
import { API, requestContent } from "../../request"
import { store } from "../../store"
import { NotFound } from "../not-found"

const BLink = (props: Link) => (
  <ALink act="Blog-A-Active" uact="Blog-A" {...props} />
)

export interface Blog {
  tree: TextTree
}

const createOriginHref = (href: string) =>
  API.createBlobHref(origin.userId, origin.repo, href + ".md")

export const Blog = ({ tree }: Blog) => {
  const links = collect(tree)
  const ref = useRef<HTMLDivElement>()

  const aniOp = () => setTimeout(() => (ref.current.style.opacity = "1"), 400)
  const open = () => {
    ref.current.style.display = "block"
    aniOp()
  }
  const close = () => (ref.current.style.display = "none")
  const isMobile = useIsMobile(close, open)

  const hash = getHash()
  useEffect(() => {
    isMobile || aniOp()
    store.dispatch("href", hash)
  }, [])

  const getLastModified = (href: string): string =>
    findNodeByPath(href, tree)["LastModified"]

  const Routes = links.reduce(
    (acc, { title, path: href, children }) => {
      if (!children) {
        acc.push(
          <Route
            key={href}
            path={href}
            component={() => (
              <div className="animated fadeIn">
                <h1 className="Blog-Main-Title">{title}</h1>
                <div className="Blog-Main-Content">
                  <LazyCom
                    fallback={<Loading />}
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
              </div>
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
          <footer>Copyright © 2019 saber2pr.</footer>
        </main>
        <aside className="Blog-Aside ani-opacityMove" ref={ref}>
          <section className="Blog-Aside-Content">
            <Tree
              from={tree}
              map={({ path: href, title, children }) => {
                if (href === store.getState().blogRoot) return <></>
                if (children) return <span>{title}</span>
                return (
                  <BLink to={href} onClick={() => isMobile() && close()}>
                    {title}
                  </BLink>
                )
              }}
            />
          </section>
        </aside>
      </TwoSide>
      <div className="Blog-Btn animated flip" onClick={open}>
        <Icon.Mao />
      </div>
    </div>
  )
}
