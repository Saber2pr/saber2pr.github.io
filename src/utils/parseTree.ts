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
