import { createTree, findNodeByPath, collect, Node } from "./createTree"
import { paths } from "./paths"
import { WriteFile, Exists, fetch, displayProgress } from "./node"
import { API } from "../src/request/api"

export const createStatusTree = async () => {
  let tree: Node
  if (await Exists(paths.config_blog_status)) {
    tree = require(paths.config_blog_status)
  } else {
    tree = await createTree({ path: paths.blog })
  }

  const nodes = collect(tree)
  const progress = await displayProgress(nodes.length)
  await Promise.all(
    nodes.map(async node => {
      if (node["LastModified"]) {
        progress()
        return
      }
      node["LastModified"] = await fetchModifiedDateFromOrigin(node.path)
      node.path = node.path.replace("/blog", "")
      await WriteFile(paths.config_blog_status, JSON.stringify(tree, null, 2))
      progress()
    })
  )
}

export const updateStatusTree = async (queryPath: string, document: object) => {
  const tree = require(paths.config_blog_status)
  const target = findNodeByPath(queryPath, tree)
  Object.assign(target, document)
  await WriteFile(paths.config_blog_status, JSON.stringify(tree))
}

export namespace Status {
  export const update = (
    type: "LastModified" = "LastModified",
    path: string,
    value: any
  ) => {
    switch (type) {
      case "LastModified":
        return updateStatusTree(path, { LastModified: value })
      default:
        break
    }
  }
}

const fetchStatusFromOrigin = (path: string) =>
  fetch({
    path: `${API.createCommitsUrl(paths.username, paths.repo)}?path=${path}`,
    headers: {
      Authorization: `token ${paths.access_token}`,
      "User-Agent": "Mozilla/5.0"
    }
  }).then(res => JSON.parse(res))

const fetchModifiedDateFromOrigin = (path: string) =>
  fetchStatusFromOrigin(path).then(res => res[0].commit.committer.date)
