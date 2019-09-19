import { TreeNode } from "@saber2pr/rc-tree"

export interface TextTree extends TreeNode {
  path: string
  title: string
}

export function collect(tree: TextTree, stack = [tree]) {
  const result: Array<{ path: string; title: string }> = []
  while (stack.length) {
    const node = stack.shift()
    node === tree || result.push(node)
    node.children && stack.push(...node.children)
  }
  return result
}
