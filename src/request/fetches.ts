import { origin } from "../config"
import { API } from "./api"
import { parseTree } from "../utils"
import { axios } from "./axios"

export const requestConfig = async () => {
  const url = origin.root + origin.data
  const url_blog = origin.root + origin.data_blog
  console.log(url_blog)
  const res = await axios.get<any>(url)
  const res_blog = await axios.get<string>(url_blog)

  res.data.JBlog = parseTree(res_blog.data)
  return res.data
}

const defaultCommitDate = [
  {
    commit: {
      committer: {
        date: "登录后查看内容"
      }
    }
  }
]

export const requestCommitDate = async (path: string) => {
  if (path.includes("&"))
    throw TypeError(`path type error: ${path}\ninclude '&'`)
  const res = await axios.get<any>(
    `${API.createCommitsUrl(origin.username, origin.repo)}?path=${path}`
  )
  if (res.status === 200 && res.data.length)
    return res.data[0].commit.committer.date
  return defaultCommitDate[0].commit.committer.date
}

export const requestContent = (path: string) =>
  axios.get(API.createContentUrl(origin.username, origin.repo, path))
