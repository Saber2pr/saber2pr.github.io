import { origin } from "../config"
import { API } from "./api"
import { parseTree, parseUpdateStr } from "../utils"
import { axios } from "./axios"

export const request = async (type: keyof typeof origin.data): Promise<any> => {
  const url = origin.root + origin.data[type]
  const res = await axios.get<string>(url)

  if (type === "blog") return parseTree(res.data)
  if (type === "activity") return parseUpdateStr(res.data)

  return res.data
}

export const requestCommitDate = async (path: string) => {
  const res = await axios.get<any>(
    `${API.createCommitsUrl(origin.username, origin.repo)}?path=${path}`,
    {
      params: {
        timestamp: Date.now()
      }
    }
  )

  if (res.status === 200 && res.data.length) {
    const commited = res.data[0]
    if (commited) return commited.commit.committer.date
  }

  return "登录后查看内容"
}

export const requestContent = (path: string) =>
  axios.get(API.createContentUrl(origin.username, origin.repo, path))
