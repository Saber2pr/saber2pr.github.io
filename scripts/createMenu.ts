/*
 * @Author: saber2pr
 * @Date: 2019-09-24 17:38:55
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2019-09-24 17:38:55
 */
import { ReadDir, Stat } from "./node"
import { join } from "path"

const resolvePath = (path: string) =>
  path
    .split("/")
    .pop()
    .split(".")[0]

export const createMenuFromRoot = async ({
  tab,
  path
}: {
  tab: number
  path: string
}): Promise<string> => {
  if (await Stat(path).then(s => s.isDirectory())) {
    const children = await ReadDir(path).then(files =>
      Promise.all(
        files.map(f =>
          createMenuFromRoot({ tab: 2 + tab, path: join(path, f) })
        )
      )
    )
    return `${" ".repeat(tab)}${resolvePath(path)}\n${children.join("\n")}`
  } else {
    return `${" ".repeat(tab)}${resolvePath(path)}`
  }
}

export const createMenu = (path: string) => createMenuFromRoot({ tab: 0, path })
