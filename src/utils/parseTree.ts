import memo from '@saber2pr/memo'
import parse, { getAbsPath } from '@saber2pr/tree-lang'

import { TextTree } from './collect'

export const parseTree = (menu: string, base = "blog") => {
  const tree = parse(menu, n => {
    n.title = n.name
    n.path = `/${base}/` + getAbsPath(n)
    return n
  })
  tree.title = base
  tree.path = `/${base}`
  return tree as TextTree
}

export interface Node {
  path: string
  children?: Array<Node>
  text?: any
  title?: string
}

export const findNodeByPath = (path: string, entry: Node) => {
  const stack = [entry]
  while (stack.length) {
    const node = stack.pop()
    if (node.path === path) return node
    node.children && stack.push(...node.children)
  }
}

export const queryRootFirstChild = (entry: Node) => {
  const children = entry.children
  for (const ch of children) {
    if (!ch.children) return ch
  }
}

export const queryRootFirstChildMemo = memo(queryRootFirstChild)
