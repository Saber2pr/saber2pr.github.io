import React, { useRef, useEffect } from "react"
import { Route, Link } from "@saber2pr/react-router"
import Tree from "@saber2pr/rc-tree"

import MD from "@saber2pr/md2jsx"

import "./style.less"
import { Icon } from "../../iconfont"

import { TwoSide, ALink, Loading, LazyCom } from "../../components"
import { useIsMobile } from "../../hooks"

import { md_theme, origin } from "../../config"
import { collect, TextTree } from "../../utils/collect"
import { timeDeltaFromNow, getHash } from "../../utils"
import { requestCommitDate, API } from "../../request"
import { store } from "../../store"

const BLink = (props: Link) => (
  <ALink act="Blog-A-Active" uact="Blog-A" {...props} />
)

export interface Blog {
  tree: TextTree
}

const fetchContent = (href: string) =>
  fetch(href + ".md").then(res => res.text())

const fetchDate = (href: string) => requestCommitDate(href + ".md")

const createOriginHref = (href: string) =>
  API.createBlobHref(origin.userId, origin.repo, href + ".md")

export const Blog = ({ tree }: Blog) => {
  const links = collect(tree)
  const ref = useRef<HTMLDivElement>()

  const open = () => (ref.current.style.display = "block")
  const close = () => (ref.current.style.display = "none")
  const isMobile = useIsMobile(close, open)

  const hash = getHash()
  useEffect(() => {
    store.dispatch("href", hash)
  }, [])

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
                  <LazyCom fallback={<Loading />} await={fetchContent(href)}>
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
                  <LazyCom
                    fallback={<p className="Blog-Main-Content-Date">loading</p>}
                    await={fetchDate(href)}
                  >
                    {res => (
                      <p className="Blog-Main-Content-Date">
                        最近更新 {timeDeltaFromNow(res)}
                      </p>
                    )}
                  </LazyCom>
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
          {Routes}
          <footer>Copyright © 2019 saber2pr.</footer>
        </main>
        <aside className="Blog-Aside" ref={ref}>
          <section className="Blog-Aside-Content ani-opacityMove">
            <Tree
              from={tree}
              map={({ path: href, title, children }) =>
                children ? (
                  <span>{title}</span>
                ) : (
                  <BLink to={href} onClick={() => isMobile() && close()}>
                    {title}
                  </BLink>
                )
              }
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
