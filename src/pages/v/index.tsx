import './style.less'

import React, { useEffect, useState } from 'react'

import { ApiUrls } from '../../api/apiUrls'
import { IResponse, IV } from '../../api/interface'
import { Loading } from '../../components'
import { axios } from '../../request'
import { getArray } from '../../utils'

export const PageV = () => {
  const [list, setList] = useState<Array<IV>>([])
  const [loading, setLoading] = useState(false)

  const initData = async () => {
    setLoading(true)
    const res = await axios.get<IResponse>(ApiUrls.v)
    setList(res?.data?.data)
    setLoading(false)
  }

  useEffect(() => {
    initData()
  }, [])

  return (
    <div className="PageV">
      <div className="header">
        <div className="col-date">时间</div>
        <div className="col-ip">IP</div>
        <div className="col-name">区域</div>
        <div className="col-type">场景</div>
        <div className="col-payload">行为</div>
      </div>
      {loading && <Loading type="block" />}
      <ul className="list">
        {getArray(list).map((item, i) => (
          <li className="list-item" key={i}>
            <div className="col-date">
              {new Date(item.date).toLocaleString()}
            </div>
            <div className="col-ip">{item.cip}</div>
            <div className="col-name">{item.cname}</div>
            <div className="col-type">{item.action?.type}</div>
            <div className="col-payload">{item.action?.payload}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
