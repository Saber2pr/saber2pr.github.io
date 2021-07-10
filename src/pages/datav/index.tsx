import './style.less'

import React, { useEffect, useState } from 'react'

import { ChartCurve, ChartMind, ChartPie } from '../../modules'
import { themeEvent } from '../../theme'
import { checkIsMob, TextTree } from '../../utils'

export interface Datav {
  data: TextTree
}

export const Datav = ({ data }: Datav) => {
  const [key, setKey] = useState(1)
  const update = () => {
    setKey(key + 1)
  }

  useEffect(() => {
    themeEvent.addEventListener('change', update)
    return () => {
      themeEvent.removeEventListener('change', update)
    }
  }, [key])

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
      {checkIsMob() || (
        <div className="row">
          <ChartMind key={key} />
        </div>
      )}
    </div>
  )
}
