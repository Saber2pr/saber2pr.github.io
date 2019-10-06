import React, { useRef, useEffect } from "react"
import { Route, Router } from "@saber2pr/router"
import Tree from "@saber2pr/rc-tree"

import MD from "@saber2pr/md2jsx"

import "./style.less"
import { Icon } from "../../iconfont"

import { TwoSide, ALink, Loading, LazyCom } from "../../components"
import { useIsMobile } from "../../hooks"

import { store } from "../../store"
import { history, md_theme, origin } from "../../config"
import { collect, TextTree } from "../../utils/collect"
import { getHash, timeDeltaFromNow } from "../../utils"
import { requestCommitDate } from "../../request"
import { AccessToken } from "@saber2pr/rc-gitment"

const BLink = (props: Omit<ALink, "act" | "uact">) => (
  <ALink act="Blog-A-Active" uact="Blog-A" {...props} scrollReset />
)

export interface Blog {
  tree: TextTree
}

const fetchContent = (href: string) =>
  fetch(href + ".md").then(res => res.text())

const fetchDate = (href: string) => requestCommitDate(href + ".md")

const createOriginHref = (href: string) => origin.sourceRepo + href + ".md"

export const Blog = ({ tree }: Blog) => {
  const links = collect(tree)
  const defaultLink = links.find(l => !("children" in l))
  const ref = useRef<HTMLDivElement>()

  const open = () => (ref.current.style.display = "block")
  const close = () => (ref.current.style.display = "none")
  const isMobile = useIsMobile(close, open)

  const hash = getHash()
  const onhashchange = () => store.dispatch("href", getHash())
  useEffect(() => {
    const init = hash === "/blog" ? defaultLink.path : hash
    if (hash) location.hash = `#${encodeURIComponent(init)}`
    window.addEventListener("hashchange", onhashchange)
    return () => window.removeEventListener("hashchange", onhashchange)
  })

  const Routes = links.reduce(
    (acc, { title, path: href }) => {
      if (href) {
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
                    await={
                      AccessToken.checkAccess()
                        ? fetchDate(href)
                        : Promise.resolve()
                    }
                  >
                    {res => (
                      <p className="Blog-Main-Content-Date">
                        最近更新 {timeDeltaFromNow(res) || "[需要登录查看]"}
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
          <Router history={history}>{Routes}</Router>
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
