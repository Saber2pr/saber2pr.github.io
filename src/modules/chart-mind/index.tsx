import './style.less'

import React, { useEffect, useRef, useState } from 'react'

import { Loading } from '../../components'
import { useLoadScript } from '../../hooks'
import { request } from '../../request'
import { getCurrentThemeType } from '../../theme'

const disableMindExpand = (root: HTMLElement = document as any) => {
  Array.from(root.getElementsByTagName('g')).forEach(node => {
    if (node?.id?.startsWith?.('node_expander')) {
      node.style.display = 'none'
    }
  })
}

const resetAnchorTarget = (root: HTMLElement = document as any) => {
  Array.from(root.getElementsByTagName('a')).forEach(node => {
    const href = node.getAttribute('xlink:href')
    if (node.target && href) {
      if (href.includes('#/blog')) {
        node.setAttribute('target', '_self')
      }
    }
  })
}

const requestIdleCallback = (fn: VoidFunction, delay = 500) =>
  setTimeout(() => fn(), delay)

export const ChartMind = () => {
  const [kityminder, loading] = useLoadScript<any>(
    'kityminder',
    'https://cdn.jsdelivr.net/gh/saber2pr/MyWeb@master/js/minder.min.js'
  )

  const containRef = useRef<HTMLDivElement>()
  const mindRef = useRef<any>()

  const [displayLoading, setDisplayLoading] = useState(loading)

  const initChart = async () => {
    if (kityminder && containRef.current) {
      setDisplayLoading(true)
      const mindJson = await request('mind')
      setDisplayLoading(false)
      if (!mindRef.current) {
        mindRef.current = new kityminder.Minder({
          renderTo: containRef.current,
        })
      }
      const minder = mindRef.current
      if (minder) {
        minder.importJson(mindJson)
        minder.execCommand(
          'Theme',
          getCurrentThemeType() === 'dark' ? 'wire' : 'fresh-blue'
        )
        window['__minder'] = minder
        requestIdleCallback(() => {
          disableMindExpand(containRef.current)
          resetAnchorTarget(containRef.current)
          minder._resetEvents()
        })
      }
    }
  }

  useEffect(() => {
    initChart()
  }, [kityminder])

  return (
    <div className="ChartMind">
      {displayLoading && <Loading />}
      <div ref={containRef} className="container"></div>
    </div>
  )
}
