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
