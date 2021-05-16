import './style.less'

import React, { useMemo } from 'react'

import { Loading } from '../../components'
import { useEcharts } from '../../hooks'
import { collect, TextTree } from '../../utils'

export interface ChartPie {
  title: string
  data: TextTree
}

export const ChartPie = ({ data, title }: ChartPie) => {
  const ds = useMemo(() => collect(data), [data])
  const pieData = useMemo(
    () =>
      ds.reduce((acc, item) => {
        if (item.children) {
          return acc.concat({
            name: item.title,
            value: item.children.length,
          })
        }
        return acc
      }, []),
    [ds]
  )

  const [ref, loading] = useEcharts(
    {
      tooltip: {
        trigger: 'item',
        formatter(params: any) {
          params = params[0] || params
          return params.marker + params.name + '<br/>' + params.value + ' 篇'
        },
      },
      grid: {
        bottom: 30,
        top: 30,
        left: 30,
        right: 30,
      },
      series: [
        {
          type: 'pie',
          roseType: 'radius',
          radius: ['40%', '70%'],
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
          data: pieData,
        },
      ],
    },
    [pieData]
  )

  return (
    <div className="ChartPie">
      {loading && <Loading />}
      <h3 className="title">{title}</h3>
      <div className="chart" ref={ref}></div>
    </div>
  )
}
