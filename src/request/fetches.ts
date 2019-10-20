import { origin } from "../config"
import { API } from "./api"
import { memoGet } from "./axios"

export const request = async (type: keyof typeof origin.data): Promise<any> => {
  const url = origin.data[type]
  const res = await memoGet<string>(url)
  return res.data
}

export const requestOriginContent = (path: string) =>
  memoGet<string>(API.createContentUrl(origin.userId, origin.repo, path))

export const requestContent = async (href: string) => {
  const res = await memoGet<string>(href)
  return res.data
}
