import { origin } from "../config"
import { API } from "./api"
import { parseTree, parseUpdateStr, Node, findNodeByPath } from "../utils"
import { memoGet } from "./axios"

export const request = async (type: keyof typeof origin.data): Promise<any> => {
  const url = origin.root + origin.data[type]
  const res = await memoGet<string>(url)

  if (type === "blog") return parseTree(res.data)
  if (type === "activity") return parseUpdateStr(res.data)

  return res.data
}

export const requestCommitDate = async (path: string) => {
  const status = await memoGet<Node>(origin.data.status)
  const res = findNodeByPath(path.replace("/blog", ""), status.data)
  return res["LastModified"]
}

export const requestContent = (path: string) =>
  memoGet(API.createContentUrl(origin.userId, origin.repo, path))
