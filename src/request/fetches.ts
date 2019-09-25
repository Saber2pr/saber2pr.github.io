import { origin } from "../config"
import { API } from "./api"
import { parseTree } from "../utils"
import { axios } from "./axios"

export const requestConfig = async () => {
  const url = origin.root + origin.data
  const url_blog = origin.root + origin.data_blog
  const res = await axios.get<any>(url)
  const res_blog = await axios.get<string>(url_blog)
  res.data.JBlog = parseTree(res_blog.data)
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
