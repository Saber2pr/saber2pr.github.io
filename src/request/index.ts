import { origin } from "../config"
import { CommitType } from "./type"

export const request = async () => {
  const url = origin.root + origin.data
  const data = await fetch(url)
  return data.json()
}

const testLogin = (): string => {
  return localStorage.getItem("access_token")
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
      Authorization: `token ${testLogin()}`
    }
  })
    .then(res => {
      if (res.status === 200) return res.json()
      return defaultCommitDate
    })
    .then(res => (res as CommitType)[0].commit.committer.date)

export namespace API {
  export const createAvatars = (name: string, size = 70) =>
    `https://avatars.githubusercontent.com/${name}?size=${size}`
  export const createCommitsUrl = (username: string, repo: string) =>
    `https://api.github.com/repos/${username}/${repo}/commits`
}
