import React, { useState, useEffect } from "react"
import "./style.less"
import { store } from "../../store"
import { Link, usePush } from "@saber2pr/react-router"
import { HighLightHTML, ScrollToTop } from "../../components"
import { useOnScrollBottom } from "../../hooks"

export interface SearchResult {}

type Item = {
  path: string
  title: string
  isBlank?: boolean
  details?: string
  searchMeta?: string
}

export const SearchResult = ({  }: SearchResult) => {
  const result: Item[] = store.getState().context
  const [push] = usePush()
  if (!result) {
    push("/")
    return <></>
  }
  if (result.length === 2) {
    return (
      <div className="SearchResult">
        <h1>共找到{result.length - 2}个结果</h1>
        <dl>
          <dt>尝试以下方式：</dt>
          {result.map(({ path, title }) => (
            <dd key={path}>
              <a className="SearchResult-Link" href={path}>
                {title}
              </a>
            </dd>
          ))}
        </dl>
      </div>
    )
  }
  const [length, setLength] = useState(store.getState().searchLen)
  const hasMore = length <= result.length

  useOnScrollBottom(() => {
    if (hasMore) {
      setLength(length + 10)
      store.getState().searchLen = length + 10
    }
  })

  useEffect(() => {
    const d = document.documentElement
    const handle = setTimeout(() => {
      d.scrollTop = store.getState().searchScrollTop
    }, 100)
    return () => {
      store.getState().searchScrollTop = d.scrollTop
      clearTimeout(handle)
    }
  }, [])

  useEffect(
    () =>
      store.subscribe(() => {
        const d = document.documentElement
        d.scrollTop = store.getState().searchScrollTop
      }),
    []
  )

  return (
    <div className="SearchResult">
      <h1>共找到{result.length - 2}个结果</h1>
      <ol>
        {result
          .slice(2, 2 + length)
          .map(({ path, title, details, searchMeta }) => (
            <li key={path}>
              <h2 className="SearchResult-Name">
                <Link className="SearchResult-Link" to={path}>
                  {title}
                </Link>
              </h2>
              <p className="SearchResult-Details">
                <HighLightHTML
                  source={details}
                  target={searchMeta}
                  transform={str =>
                    `<a class="SearchInput-List-Key SearchResult-Key" href="${"#" +
                      path}">${str}</a>`
                  }
                  offset={40}
                />
              </p>
            </li>
          ))}
      </ol>
      <div
        style={{
          textAlign: "center",
          width: "100%",
          lineHeight: "2rem",
          marginTop: "4rem"
        }}
      >
        {hasMore && (
          <span
            style={{
              textDecoration: "underline",
              cursor: "pointer"
            }}
            onClick={() => setLength(length + 5)}
          >
            更多
          </span>
        )}
      </div>
      <ScrollToTop />
    </div>
  )
}
