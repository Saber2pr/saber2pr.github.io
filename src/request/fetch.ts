import { origin } from "../config"
import { API } from "./api"
import { CommitType } from "./type"
import { AccessToken } from "@saber2pr/rc-gitment"
import { interceptor } from "./interceptor"
import { parseTree } from "../utils"

export const requestConfig = async () => {
  const url = origin.root + origin.data
  const url_blog = origin.root + origin.data_blog
  const data = await fetch(url).then(interceptor)
  const data_blog = await fetch(url_blog).then(interceptor)
  const res = await data.json()
  res.JBlog = parseTree(await data_blog.text())
  return res
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

export const requestCommitDate = (path: string) =>
  fetch(`${API.createCommitsUrl(origin.username, origin.repo)}?path=${path}`, {
    headers: {
      Authorization: `token ${AccessToken.checkAccess()}`
    }
  })
    .then(res => {
      if (res.status === 200) return res.json()
      return defaultCommitDate
    })
    .then(res => (res as CommitType)[0].commit.committer.date)

export const requestContent = (path: string) =>
  fetch(API.createContentUrl(origin.username, origin.repo, path))
    .then(interceptor)
    .then(res => res.json())
