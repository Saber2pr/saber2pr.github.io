/*
 * @Author: saber2pr
 * @Date: 2019-07-15 11:59:42
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-10-09 21:39:51
 */
import { join, parse, dirname } from "path"
import { Stat, ReadDir } from "./node"

export interface Node {
  path: string
  children?: Array<Node>
  text?: any
  title?: string
}

export async function createTree(
  root: Node,
  callback?: (node: Node) => any,
  config = root
) {
  const sta = await Stat(root.path)
  root.title = parse(root.path).name
  if (sta.isDirectory()) {
    const children = await ReadDir(root.path)
    root.children = await Promise.all(
      children.map(path =>
        createTree({ path: join(root.path, path) }, callback, config)
      )
    )
    root.path = root.path.replace(dirname(config.path), "").replace(/\\/g, "/")
  } else {
    root.path = root.path.replace(dirname(config.path), "").replace(/\\/g, "/")
    callback && callback(root)
  }
  return root
}

export const findNodeByPath = (path: string, entry: Node) => {
  const stack = [entry]
  while (stack.length) {
    const node = stack.pop()
    if (node.path === path) return node
    node.children && stack.push(...node.children)
  }
}

export const traverse = (tree: Node, callback: (node: Node) => void) => {
  const stack = [tree]
  while (stack.length) {
    const node = stack.pop()
    callback(node)
    node.children && stack.push(...node.children)
  }
}

export const collect = (tree: Node) => {
  const result: Node[] = []
  traverse(tree, node => node.children || result.push(node))
  return result
}
