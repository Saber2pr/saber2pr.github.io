import { origin } from "../config"
import { memoGet, axios } from "./axios"
import { ResponseConfig } from "@saber2pr/request"

let should_omit_base = !!origin.omit_base.find(url =>
  location.origin.includes(url)
)

export const request = async (type: keyof typeof origin.data): Promise<any> => {
  let url = origin.data[type]
  if (should_omit_base) {
  } else {
    url = "/" + origin.repo + url
  }

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
  if (should_omit_base) {
  } else {
    href = "/" + origin.repo + href
  }
  const res = await memoGet<string>(href)
  if (!res) throw new Error("错误：请求的资源未找到！")
  return res.data
}
