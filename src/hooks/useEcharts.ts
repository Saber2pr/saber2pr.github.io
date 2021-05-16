import type { ECharts } from 'echarts'
import React, { DependencyList, useEffect, useRef, useState } from 'react'

type UseEchartsResult = [React.MutableRefObject<HTMLDivElement>, boolean]

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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (options === null) {
      return
    }
    setLoading(true)
    let chart: ECharts = null
    if (echarts) {
      chart = echarts.init(ref.current)
      if (typeof options === 'function') {
        Promise.resolve(options(chart)).then(() => setLoading(false))
      } else {
        chart.setOption(options)
        setLoading(false)
      }
    }
    return () => {
      if (chart) {
        chart.dispose()
      }
    }
  }, [echarts, ...deps])

  return [ref, loading]
}
