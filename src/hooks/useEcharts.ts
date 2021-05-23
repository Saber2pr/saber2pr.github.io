import React, { DependencyList, useEffect, useRef } from 'react'

import { useLoadScript } from './useLoadScript'

import type { ECharts, init } from 'echarts'
type UseEchartsResult = [React.MutableRefObject<HTMLDivElement>, boolean]

const useEchartsLib = () => {
  return useLoadScript<{ init: typeof init }>(
    'echarts',
    '//cdn.jsdelivr.net/npm/echarts@5.1.1/dist/echarts.min.js'
  )
}

export function useEcharts(
  callback: (chart: ECharts) => any,
  deps?: DependencyList
): UseEchartsResult
export function useEcharts(
  options: object,
  deps?: DependencyList
): UseEchartsResult

export function useEcharts(
  options: ((chart: ECharts) => any | Promise<any>) | object,
  deps: DependencyList = []
): UseEchartsResult {
  const ref = useRef<HTMLDivElement>()

  const [echarts, loading] = useEchartsLib()
  useEffect(() => {
    if (options === null) {
      return
    }
    let chart: ECharts = null
    if (echarts) {
      chart = echarts.init(ref.current)
      if (typeof options === 'function') {
        options(chart)
      } else {
        chart.setOption(options)
      }
    }
    return () => {
      if (chart) {
        chart.dispose()
      }
    }
  }, [loading, ...deps])

  return [ref, loading]
}
