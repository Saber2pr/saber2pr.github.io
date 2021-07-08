import { ResponseConfig } from '@saber2pr/request'

import { origin } from '../config'
import { axios, memoGet } from './axios'

export const request = async (type: keyof typeof origin.data): Promise<any> => {
  let url = origin.data[type]
  let res: ResponseConfig<any>

  // version no-cache
  if (type === "version") {
    // no memo
    url += `?t=${Date.now()}`
    res = await axios.get(url)
  } else {
    // memo get
    res = await memoGet<string>(url)
  }

  return res.data
}

export const requestContent = async (href: string) => {
  const res = await memoGet<string>(href)
  if (!res) throw new Error("错误：请求的资源未找到！")
  return res.data
}
