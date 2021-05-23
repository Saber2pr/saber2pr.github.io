import './style.less'

import React, { useMemo } from 'react'

import { Loading } from '../../components'
import { useEcharts } from '../../hooks'
import { collect, queryRootFirstChild, TextTree } from '../../utils'

export interface ChartPie {
  title: string
  data: TextTree
}

export const ChartPie = ({ data, title }: ChartPie) => {
  const ds = useMemo(() => collect(data), [data])
  const [pieData, map, sum] = useMemo(() => {
    const map: { [title: string]: TextTree } = {}
    let sum = 0
    const result = ds.reduce((acc, item) => {
      map[item.title] = item
      if (item.children) {
        return acc.concat({
          name: item.title,
          value: item.children.length,
        })
      } else {
        sum++
      }
      return acc
    }, [])
    return [result, map, sum]
  }, [ds])

  const [ref, loading] = useEcharts(
    chart => {
      chart.on(
        'click',
        'series.pie.label',
        (args: { data: { name: string } }) => {
          if (map[args?.data?.name]) {
            const firstChild = queryRootFirstChild(map[args?.data?.name])
            location.hash = firstChild.path
          }
        }
      )
      chart.setOption({
        title: {
          text: `${sum}篇`,
          textStyle: {
            fontSize: 20,
            color: '#747474',
          },
          textAlign: 'center',
          textVerticalAlign: 'center',
          left: '50%',
          top: '50%',
        },
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
            label: {
              textBorderColor: 'transparent',
              color: '#747474',
            },
            itemStyle: {
              borderRadius: 4,
              borderWidth: 2,
            },
            data: pieData,
          },
        ],
      })
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
