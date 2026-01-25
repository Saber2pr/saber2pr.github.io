Double buffering can be used to delete multiple nodes in the linked list, that is, instead of modifying the original linked list, a new linked list is generated:
```ts
const clearDoneNode = (treeNode: TreeNode[]) => {
  if (!(treeNode?.length > 0)) return []
  const nextTree: TreeNode[] = []
  for (const node of treeNode) {
    // 删除节点
    if (node.todo.done) {
      continue
    }
    // 生成新链表
    nextTree.push(node)
    // 向下遍历
    node.children = clearDoneNode(node.children)
  }
  // 向上回溯
  return nextTree
}
```
Convert the node to get the path:
```ts
export interface TreeLike {
  children?: any[];
}

export const mapTree = <N extends TreeLike, T extends TreeLike>(
  treeNode: N[],
  mapFunc: (node: N) => T,
) => {
  if (!(treeNode?.length > 0)) return [];
  const nextTree: T[] = [];
  for (const node of treeNode) {
    const newNode = mapFunc(node);
    newNode.children = mapTree(node.children, mapFunc);
    nextTree.push(newNode);
  }
  return nextTree;
};

export const getLeafPath = <N extends TreeLike>(
  children: N[],
  labelKey: keyof N,
  targetKey: keyof N,
  targetValue: any,
  path = '',
) => {
  for (const node of children) {
    const nextPath = `${path}/${node[labelKey]}`;
    if (node[targetKey] === targetValue) {
      return nextPath;
    }
    const nextChildren = node?.children || [];
    const result = getLeafPath(nextChildren, labelKey, targetKey, targetValue, nextPath);
    if (result) {
      return result;
    }
  }
};
```