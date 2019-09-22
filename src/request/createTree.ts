import { requestContent } from "."
import { origin } from "../config"

export interface ContentNode {
  name: string
  path: string
  type: string
  children?: ContentNode[]
}

const defaultRoot = {
  name: origin.md,
  path: origin.md,
  type: "dir"
}

export const createTree = async (root: ContentNode = defaultRoot) => {
  if (root.type === "dir") {
    const children = await requestContent(root.path)
    root.children = await Promise.all(children.map(createTree))
  }
  const node = {
    title: root.name.split(".")[0],
    path: `/${root.path}`
  }
  if (root.children) node["children"] = root.children
  return node
}
