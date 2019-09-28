import { origin } from "../config"
import { API } from "./api"
import { parseTree, parseUpdateStr } from "../utils"
import { axios } from "./axios"

export const requestConfig = async () => {
  const url = origin.root + origin.data
  const res = await axios.get<any>(url)
  res.data.JBlog = await requestBlogs()
  res.data.JActs = await requestUpdates()
  return res.data
}

export const requestBlogs = async () => {
  const url_blog = origin.root + origin.data_blog
  const res_blog = await axios.get<string>(url_blog)
  return parseTree(res_blog.data)
}

export const requestUpdates = async () => {
  const url_blog_update = origin.root + origin.data_blog_update
  const res = await axios.get<string>(url_blog_update)
  return parseUpdateStr(res.data)
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
