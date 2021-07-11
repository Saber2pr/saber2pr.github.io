import './style.less'

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'

import { Link, usePush } from '@saber2pr/react-router'

import { pushIV } from '../../api/pushIV'
import { Routes } from '../../config'
import { useIsMob, useSingleton } from '../../hooks'
import { Icon } from '../../iconfont'
import { Blog } from '../../pages'
import { requestContent } from '../../request'
import { store } from '../../store'
import { checkIsMob, collect, debounce } from '../../utils'
import { handleKeyInput } from '../../utils/handleKeyInput'
import { HighLightHTML } from '../highLight-html'
import { Loading } from '../loading'

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
  isBlank: true,
})

const SearchMDN = (value: string): Item => ({
  title: `在MDN上搜索: "${value}"`,
  path: `https://developer.mozilla.org/zh-CN/search?q=${value}`,
  isBlank: true,
})

const getList = (list: Item[]) =>
  Promise.all(
    list.map<Promise<Item>>(({ path, title }) =>
      requestContent(path + '.md').then(details => ({
        path,
        title,
        details,
      }))
    )
  )

const useSearch = (blog: Blog['tree']): [Item[], Search, string] => {
  const list = collect(blog).filter(l => l.title && !l['children'])
  const listMon = useSingleton(() => getList(list))
  const [result, set] = useState<Item[]>([])
  const [query, setSearch] = useState('')

  useEffect(() => {
    if (query) {
      listMon().then(res => {
        const acc: Item[] = [SearchGit(query), SearchMDN(query)]
        for (const item of res) {
          if (
            item.details
              .concat(item.title)
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
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

const Input = React.forwardRef<
  { blur: Function },
  {
    search: Search
    onblur?: Function
    onfocus?: Function
  }
>(({ search, onblur, onfocus }, ref) => {
  const isMob = useIsMob()
  const styles = {
    open: { width: isMob ? '7rem' : '10rem' },
    close: { width: '0' },
  }
  const [style, update] = useState<React.CSSProperties>(styles.close)

  const inputRef = useRef<HTMLInputElement>()
  useImperativeHandle(
    ref,
    () => ({
      blur: () => inputRef.current.blur(),
    }),
    []
  )

  const [push] = usePush()
  return (
    <>
      <span
        className="SearchInput-Icon"
        onClick={() => inputRef.current.focus()}
        title="搜索笔记"
      >
        <Icon.Sousuo />
        <span className="SearchInput-Icon-Name">搜索</span>
      </span>
      <input
        className="SearchInput-Input"
        type="search"
        ref={inputRef}
        list="blog"
        onInput={e => {
          const input: string = e.target['value']
          if (input.startsWith('encode=') || input.startsWith('decode=')) {
            store.dispatch('context', input)
            push(Routes.secret.href)
            inputRef.current.value = ''
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
})

const renderResult = (result: Item[], enable: boolean, onSubmit: Function) => {
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
              transform={str =>
                `<span class="SearchInput-List-Key">${str}</span>`
              }
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
        <li>
          <span className="SearchInput-List-Head" />
          <div className="SearchInput-List-Name">在Internet上搜索</div>
        </li>
      )}
      {blanks}
      {items}
      <li className="SearchInput-List-More">
        <a onClick={() => onSubmit()}>更多结果</a>
      </li>
    </>
  )
}

export interface SearchInput {
  blog: Blog['tree']
}

export const SearchInput = ({ blog }: SearchInput) => {
  const [result, search, query] = useSearch(blog)
  const [enable, set] = useState(false)
  const ref = useRef<HTMLInputElement>()
  const [push] = usePush()
  const onSubmit = () => {
    set(false)
    ref.current.blur()
    if (!result[0]) return
    push(`${Routes.search.href}?q=${query}`)
    store.dispatch('searchScrollTop', 0)
    store.getState().context = result
    pushIV({
      type: '搜索',
      payload: query,
    })
    handleKeyInput(query)
  }

  const [isMob, setIsMob] = useState(false)
  useEffect(() => {
    setIsMob(checkIsMob())
  }, [])

  return (
    <span className="SearchInput">
      <form
        onSubmit={event => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Input
          ref={ref}
          search={search}
          onblur={() => setTimeout(() => set(false), 500)}
          onfocus={() => set(true)}
        />
      </form>
      <ul className="SearchInput-List">
        {renderResult(
          result.slice(0, isMob ? 5 : 6),
          enable && !!query,
          onSubmit
        )}
      </ul>
    </span>
  )
}
