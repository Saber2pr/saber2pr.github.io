import './style.less'

import React from 'react'

import visit, { BusuanziResponse } from '@saber2pr/pv-count'

import { useAsync } from '../../hooks'

export interface Uv {}

export const Uv = ({  }: Uv) => {
  const { site_uv } = useAsync(visit, { site_uv: 0 } as BusuanziResponse)
  return <div className="footer-uv">uv:{site_uv}</div>
}
