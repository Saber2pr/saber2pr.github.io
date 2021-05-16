import './style.less'

import React, { useMemo } from 'react'

import { Loading } from '../../components'
import { useEcharts, useIsMob } from '../../hooks'
import { collect, TextTree } from '../../utils'

export interface ChartCurve {
  data: TextTree
  title: string
}

const getItemMonth = (item: TextTree) => {
  if (item && item['LastModified']) {
    const date = new Date(Number(item['LastModified']))
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`
  }
}

const formatTime = (time: string) => `${time.slice(0, 4)}/${time.slice(4)}`

export const ChartCurve = ({ data, title }: ChartCurve) => {
  const ds = useMemo(() => collect(data), [data])
  const [xs, ys] = useMemo(() => {
    const sortMap = {}
    for (const item of ds) {
      if (item.LastModified) {
        const month = getItemMonth(item)
        if (month in sortMap) {
          sortMap[month]++
        } else {
          sortMap[month] = 1
        }
      }
    }
    const ys = []
    const xs = []
    Object.keys(sortMap).forEach(time => {
      xs.push(formatTime(time))
      ys.push(sortMap[time])
    })
    return [xs, ys]
  }, [ds])

  const isMob = useIsMob()

  const [ref, loading] = useEcharts(
    {
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params: any) {
          params = params[0] || params
          return params.marker + params.name + '<br/>' + params.value + ' 篇'
        },
      },
      grid: {
        bottom: 30,
        top: 30,
        left: isMob ? 45 : 30,
        right: isMob ? 45 : 30,
      },
      xAxis: {
        type: 'category',
        data: xs,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        name: '发布文章数',
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          formatter(value: number) {
            return `${value}`
          },
        },
      },
      series: [
        {
          data: ys,
          type: 'line',
          smooth: true,
        },
      ],
    },
    [xs, ys, isMob]
  )

  return (
    <div className="ChartCurve">
      {loading && <Loading />}
      <h3 className="title">{title}</h3>
      <div className="chart" ref={ref}></div>
    </div>
  )
}
