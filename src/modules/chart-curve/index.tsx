import './style.less'

import React, { useMemo } from 'react'

import { Loading } from '../../components'
import { useEcharts, useIsMob } from '../../hooks'
import { collect, TextTree } from '../../utils'

export interface ChartCurve {
  data: TextTree
  title: string
}

const formatTimeStamp = (ts: number) => {
  const date = new Date(Number(ts))
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
}

const getItemMonth = (item: TextTree) => {
  if (item && item['LastModified']) {
    return formatTimeStamp(item['LastModified'])
  }
}

const formatTime = (time: string) => `${time.slice(0, 4)}/${time.slice(4)}`

const getParentTitle = (item: TextTree) => {
  if (item.children) {
    return item.title
  } else {
    const path = item.path
    const meta = path.split('/')
    return meta[meta.length - 2]
  }
}

type SortMap = {
  [date: string]: number
}

type CateMap = {
  [name: string]: SortMap
}

type ScatterItem = {
  type: 'scatter'
  data: { name: string; value: number; cate: string; cateCount: number }[]
  [k: string]: any
}

export const ChartCurve = ({ data, title }: ChartCurve) => {
  const ds = useMemo(() => collect(data), [data])
  const [xs, ys, cateMap, maxY, ratio] = useMemo(() => {
    const sortMap = {}
    const cateMap: CateMap = {}
    for (const item of ds) {
      const month = getItemMonth(item)
      if (month) {
        if (month in sortMap) {
          sortMap[month]++
        } else {
          sortMap[month] = 1
        }
      }

      if (item.children) {
        if (!(item.title in cateMap)) {
          cateMap[item.title] = {}
        }
      }
      if (item['LastModified']) {
        const cate = getParentTitle(item)
        if (cate) {
          const cateDvMap = cateMap[cate]
          if (cateDvMap) {
            const date = formatTime(month)
            if (date in cateDvMap) {
              cateDvMap[date]++
            } else {
              cateDvMap[date] = 1
            }
          }
        }
      }
    }
    const ys = []
    const xs = []
    Object.keys(sortMap).forEach(time => {
      const date = formatTime(time)
      xs.push(date)
      ys.push(sortMap[time])
    })
    const maxY = Math.max.apply(null, ys)
    return [xs, ys, cateMap, maxY, maxY / xs.length]
  }, [ds])

  const cateKeys = useMemo(
    () => (cateMap ? Object.keys(cateMap) : []),
    [cateMap]
  )

  const scatter = useMemo<ScatterItem>(() => {
    const data: ScatterItem['data'] = []
    let maxCateCount = 0

    for (let i = 0; i < xs.length; i++) {
      const currentDate = xs[i]

      // find maxCount Cate in the current date
      let catMaxCountName = ''
      let cateMaxCount = 0
      for (const cate of cateKeys) {
        const dv = cateMap[cate]
        if (dv[currentDate] > cateMaxCount) {
          cateMaxCount = dv[currentDate]
          catMaxCountName = cate
        }
      }
      if (cateMaxCount > maxCateCount) {
        maxCateCount = cateMaxCount
      }

      data.push({
        name: currentDate,
        value: i * ratio,
        cate: catMaxCountName,
        cateCount: cateMaxCount,
      })
    }
    return {
      data,
      type: 'scatter',
      label: {
        show: true,
        formatter: (params: { data: ScatterItem['data'][0] }) => {
          return `${params?.data?.cate}`
        },
        color: '#747474',
      },
      symbolSize: (value: number, params: { data: ScatterItem['data'][0] }) =>
        (params?.data?.cateCount * maxY) / maxCateCount,
      itemStyle: {
        color: 'rgba(132, 150, 255, 0.28)',
      },
    }
  }, [cateMap, xs, cateKeys])

  const isMob = useIsMob()

  const [ref, loading] = useEcharts(
    {
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params: any) {
          const curveParams = params[0]
          const scatterParams = params[1] as { data: ScatterItem['data'][0] }
          return `${curveParams?.marker}${curveParams?.name}
          <br/>${curveParams?.value}篇
          <br/>当月focus: ${scatterParams?.data?.cate}`
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
        splitLine: {
          lineStyle: {
            color: 'rgba(158, 158, 158, 0.2)',
          },
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
          showSymbol: false,
        },
        scatter,
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
