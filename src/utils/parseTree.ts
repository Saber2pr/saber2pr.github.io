import parse, { getAbsPath } from "@saber2pr/tree-lang"

export const parseTree = (menu: string, base = "blog") => {
  const tree = parse(menu, n => {
    n.title = n.name
    n.path = `/${base}/` + getAbsPath(n)
    return n
  })
  tree.title = base
  tree.path = `/${base}`
  return tree
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
