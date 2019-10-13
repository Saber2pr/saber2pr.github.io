import React, { useState, useRef, Fragment } from "react"
import "./style.less"
import { Blog } from "../../pages"
import { collect } from "../../utils"
import { Link, usePush } from "@saber2pr/router"
import { Icon } from "../../iconfont"
import { store } from "../../store"

export interface SearchInput {
  blog: Blog["tree"]
}

type Item = {
  path: string
  title: string
  isBlank?: boolean
}

type Search = (value: string) => void

const SearchGit = (value: string): Item => ({
  title: `> 在Github上搜索: "${value}"`,
  path: `https://github.com/search?q=${value}`,
  isBlank: true
})

const SearchMDN = (value: string): Item => ({
  title: `> 在MDN上搜索: "${value}"`,
  path: `https://developer.mozilla.org/zh-CN/search?q=${value}`,
  isBlank: true
})

const useSearch = (blog: Blog["tree"]): [Item[], Search] => {
  const list = collect(blog).filter(l => l.title && !l["children"])
  const [result, set] = useState<Item[]>([])
  const search = (value: string) => {
    if (value) {
      const res = list
        .filter(l => l.title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
      set([SearchGit(value), SearchMDN(value), ...res])
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
  const styles = {
    open: { width: "6rem" },
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
            push("/secret", true)
            ref.current.value = ""
          } else {
            search(input)
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
  for (const { title, path, isBlank } of result) {
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
          <Link to={path} onClick={() => location.reload()} title={path}>
            {title}
          </Link>
        </li>
      )
    }
  }
  return (
    <>
      {blanks}
      {items.length !== 0 && <hr />}
      {items}
    </>
  )
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
