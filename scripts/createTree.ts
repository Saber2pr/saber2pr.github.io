/*
 * @Author: saber2pr
 * @Date: 2019-07-15 11:59:42
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-10-09 21:39:51
 */
import { dirname, join, parse } from 'path'

import { ReadDir, Stat } from './node'
import { isSamePath } from './utils'

export interface Node {
  path: string
  children?: Array<Node>
  text?: any
  title?: string
}

const verPath = (path: string, basePath: string) =>
  path.replace(dirname(basePath), '').replace(/\\/g, '/')

const sortChildren = (children: Node[]) => {
  const dir = []
  const file = []
  for (const ch of children) {
    ch.children ? dir.push(ch) : file.push(ch)
  }
  return dir.concat(file)
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
    root.children = sortChildren(root.children)
    root.path = verPath(root.path, config.path)
  } else {
    root.path = verPath(root.path, config.path)
    callback && callback(root)
  }
  return root
}

export const findNodeByPath = (path: string, entry: Node) => {
  const stack = [entry]
  while (stack.length) {
    const node = stack.pop()
    if (isSamePath(node.path, path)) return node
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
