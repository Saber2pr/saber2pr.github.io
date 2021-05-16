import './style.less'

import React from 'react'

import { ChartCurve, ChartPie } from '../../modules'
import { TextTree } from '../../utils'

export interface Datav {
  data: TextTree
}

export const Datav = ({ data }: Datav) => {
  return (
    <div className="Datav">
      <div className="row">
        <div className="col">
          <ChartPie title="技术侧重概览" data={data} />
        </div>
        <div className="col">
          <ChartCurve title="文章发布频率" data={data} />
        </div>
      </div>
    </div>
  )
}
