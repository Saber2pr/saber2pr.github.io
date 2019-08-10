/*
 * @Author: saber2pr
 * @Date: 2019-07-15 11:59:42
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-08-01 19:15:57
 */
import { join, parse, dirname } from "path";
import { Stat, ReadDir, ReadFile } from "./node";

export interface Node {
  path: string;
  children?: Array<Node>;
  text?: any;
  title?: string;
}

export async function createTree(root: Node, config = root) {
  const sta = await Stat(root.path);
  root.title = parse(root.path).name;
  if (sta.isDirectory()) {
    const children = await ReadDir(root.path);
    root.children = await Promise.all(
      children.map(path => createTree({ path: join(root.path, path) }, config))
    );
  } else {
    const buffer = await ReadFile(root.path);
    root.text = buffer.toString();
  }
  root.path = root.path.replace(dirname(config.path), "").replace(/\\/g, '/');
  return root;
}
