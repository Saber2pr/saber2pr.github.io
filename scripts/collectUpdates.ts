/*
 * @Author: saber2pr
 * @Date: 2019-09-28 10:54:52
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-10-09 21:46:58
 */
import { diff, commit, Commit } from "@saber2pr/git"
import { ReadFile, WriteFile, Exists } from "./node"

type Update = {
  type: Commit["type"]
  path: string
  date: string
}

export const collectUpdates = async (root = "./blog") => {
  const commits = await diff(root)
  const updates = commits.map<Update>(({ type, master: { path } }) => ({
    type,
    path: path.replace(root, ""),
    date: new Date().toLocaleString()
  }))
  await commit(commits)
  return updates
}

export const stringifyUpdates = (updates: Update[]): string =>
  updates.map(({ type, path, date }) => `${type}&${path}&${date}`).join(";")

export const addUpdateStringToFile = async (
  path: string,
  updateStr: string
) => {
  if (!(await Exists(path))) await WriteFile(path, "")
  const text = await ReadFile(path).then(b => b.toString())
  const subUpdateStr = [...updateStr.split(";"), ...text.split(";")]
    .slice(0, 50)
    .filter(u => u)
    .join(";")
  await WriteFile(path, subUpdateStr)
}
