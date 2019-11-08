import React, { useState, useRef } from "react"
import "./style.less"
import { Blog } from "../../pages"
import { collect, debounce } from "../../utils"
import { Link, usePush } from "@saber2pr/react-router"
import { Icon } from "../../iconfont"
import { store } from "../../store"
import { useIsMob, useSingleton } from "../../hooks"
import { requestContent } from "../../request"
import { HighLightHTML } from "../highLight-html"

type Item = {
  path: string
  title: string
  isBlank?: boolean
  details?: string
  searchMeta?: string
}

type Search = (value: string) => void

const SearchGit = (value: string): Item => ({
  title: `在Github上搜索: "${value}"`,
  path: `https://github.com/search?q=${value}`,
  isBlank: true
})

const SearchMDN = (value: string): Item => ({
  title: `在MDN上搜索: "${value}"`,
  path: `https://developer.mozilla.org/zh-CN/search?q=${value}`,
  isBlank: true
})

const getList = (list: Item[]) =>
  Promise.all(
    list.map<Promise<Item>>(({ path, title }) =>
      requestContent(path + ".md").then(details => ({
        path,
        title,
        details
      }))
    )
  )

const useSearch = (blog: Blog["tree"]): [Item[], Search] => {
  const list = collect(blog).filter(l => l.title && !l["children"])
  const [result, set] = useState<Item[]>([])
  const listIns = useSingleton(() => getList(list))

  const search = (value: string) => {
    if (value) {
      listIns.then(res => {
        set([
          SearchGit(value),
          SearchMDN(value),
          ...res
            .reduce(
              (acc, item) =>
                item.details.includes(value)
                  ? acc.concat({ ...item, searchMeta: value })
                  : acc,
              []
            )
            .slice(0, 5)
        ])
      })
    } else {
      set([])
    }
  }
  return [result, search]
}

const Input = ({
  search,
  onblur,
  onfocus
}: {
  search: Search
  onblur?: Function
  onfocus?: Function
}) => {
  const isMob = useIsMob()
  const styles = {
    open: { width: isMob ? "6rem" : "10rem" },
    close: { width: "0" }
  }
  const [style, update] = useState<React.CSSProperties>(styles.close)
  const ref = useRef<HTMLInputElement>()
  const [push] = usePush()
  return (
    <>
      <span className="SearchInput-Icon" onClick={() => ref.current.focus()}>
        <Icon.Sousuo />
        <span className="SearchInput-Icon-Name">搜索</span>
      </span>
      <input
        className="SearchInput-Input"
        ref={ref}
        list="blog"
        onInput={e => {
          const input: string = e.target["value"]
          if (input.startsWith("encode=") || input.startsWith("decode=")) {
            store.dispatch("context", input)
            push("/secret")
            ref.current.value = ""
          } else {
            debounce(() => search(input))
          }
        }}
        style={style}
        onFocus={() => {
          onfocus && onfocus()
          update(styles.open)
        }}
        onBlur={() => {
          onblur && onblur()
          setTimeout(() => update(styles.close), 500)
        }}
        placeholder="输入关键词"
      />
    </>
  )
}

const renderResult = (result: Item[]) => {
  const blanks: JSX.Element[] = []
  const items: JSX.Element[] = []
  const [push] = usePush()
  for (const { title, path, isBlank, details, searchMeta } of result) {
    if (isBlank) {
      blanks.push(
        <li key={path}>
          <a href={path} target="_blank" title={path}>
            {title}
          </a>
        </li>
      )
    } else {
      items.push(
        <li key={path}>
          <div className="SearchInput-List-Name">{title}</div>
          <Link to={path} title={path} onClick={() => push(path)}>
            <HighLightHTML
              source={details}
              target={searchMeta}
              highClassName="SearchInput-List-Key"
            />
          </Link>
        </li>
      )
    }
  }
  return (
    <>
      {blanks[0] && (
        <>
          <span className="SearchInput-Head" />
          <div className="SearchInput-List-Name">在Internet上搜索</div>
        </>
      )}
      {blanks}
      {items}
    </>
  )
}

export interface SearchInput {
  blog: Blog["tree"]
}

export const SearchInput = ({ blog }: SearchInput) => {
  const [result, search] = useSearch(blog)
  const [enable, set] = useState(true)
  return (
    <span className="SearchInput">
      <Input
        search={search}
        onblur={() => setTimeout(() => set(false), 500)}
        onfocus={() => set(true)}
      />
      <ul className="SearchInput-List">{enable && renderResult(result)}</ul>
    </span>
  )
}
