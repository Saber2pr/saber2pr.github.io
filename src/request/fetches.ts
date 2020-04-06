import { origin } from "../config"
import { memoGet } from "./axios"

export const request = async (type: keyof typeof origin.data): Promise<any> => {
  let url = origin.data[type]
  if (/localhost/.test(location.origin)) {
  } else {
    url = "/" + origin.repo + url
  }
  const res = await memoGet<string>(url)
  return res.data
}

export const requestContent = async (href: string) => {
  if (/localhost/.test(location.origin)) {
  } else {
    href = "/" + origin.repo + href
  }
  const res = await memoGet<string>(href)
  if (!res) throw new Error("错误：请求的资源未找到！")
  return res.data
}
