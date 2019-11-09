import React, { useState, useRef, useEffect } from "react"
import "./style.less"
import { Blog } from "../../pages"
import { collect, debounce } from "../../utils"
import { Link, usePush } from "@saber2pr/react-router"
import { Icon } from "../../iconfont"
import { store } from "../../store"
import { useIsMob, useSingleton } from "../../hooks"
import { requestContent } from "../../request"
import { HighLightHTML } from "../highLight-html"
import { Loading } from "../loading"

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

const useSearch = (blog: Blog["tree"]): [Item[], Search, string] => {
  const list = collect(blog).filter(l => l.title && !l["children"])
  const listMon = useSingleton(() => getList(list))
  const [result, set] = useState<Item[]>([])
  const [query, setSearch] = useState("")

  useEffect(() => {
    if (query) {
      listMon().then(res => {
        const acc: Item[] = [SearchGit(query), SearchMDN(query)]
        for (const item of res) {
          if (acc.length > 5) break
          if (item.details.includes(query)) {
            item.searchMeta = query
            acc.push(item)
          }
        }
        set(acc)
      })
    } else {
      set([])
    }
  }, [query])

  return [result, setSearch, query]
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

const renderResult = (result: Item[], enable: boolean) => {
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
          <Link
            to={path}
            title={path}
            onClick={() => push(path)}
            className="SearchInput-List-AText"
          >
            <HighLightHTML
              source={details}
              target={searchMeta}
              highClassName="SearchInput-List-Key"
            />
            ...<span className="SearchInput-List-Btn">查看内容</span>
          </Link>
        </li>
      )
    }
  }
  if (!enable) return <></>
  if (result.length === 0) return <Loading />
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
  const [result, search, query] = useSearch(blog)
  const [enable, set] = useState(false)
  return (
    <span className="SearchInput">
      <Input
        search={search}
        onblur={() => setTimeout(() => set(false), 500)}
        onfocus={() => set(true)}
      />
      <ul className="SearchInput-List">
        {renderResult(result, enable && !!query)}
      </ul>
    </span>
  )
}
