import { WriteFile, ReadFile } from "./node"
import { collectUpdates } from "./collectUpdates"
import { paths } from "./paths"
import { createTree, Node, traverse } from "./createTree"
import { findNodeByPath, versionUp } from "../src/utils"
import { checkJson } from "./checkJson"
import { join } from "path"
import { origin } from "../src/config/origin"

async function main() {
  // get status
  const status: Node[] = await ReadFile(paths.status).then(b =>
    JSON.parse(b.toString())
  )

  // create blog tree from md
  const tree = await createTree({ path: paths.md }, node => {
    const old = status.find(n => join(origin.md, n.path) === node.path)
    if (old) {
      node["LastModified"] = old["LastModified"]
    } else {
      status.push({ path: node.path.replace(origin.md, ""), title: node.title })
    }
  })

  // create updates from md
  const updates = await collectUpdates(paths.md)

  // update tree modified date
  const cleans: string[] = []
  for (const { path, date } of updates) {
    const node = findNodeByPath(join(origin.md, path), tree)
    if (node) {
      node["LastModified"] = date
      const old = status.find(n => join(origin.md, n.path) === node.path)
      if (old) old["LastModified"] = date
    } else {
      cleans.push(path)
    }
  }

  cleans.forEach(clean =>
    status.splice(status.findIndex(n => n.path === clean), 1)
  )

  const acts: any[] = await ReadFile(paths.acts).then(b =>
    JSON.parse(b.toString())
  )
  acts.unshift(
    ...updates.map(({ path, type, date }) => ({ type, text: path, date }))
  )

  traverse(tree, node => {
    node.path = node.path.replace(/.md$/, "")
  })

  // update version
  const versionData = await ReadFile(paths.version).then(b =>
    JSON.parse(b.toString())
  )

  versionData.version = versionUp(versionData.version)

  // update file
  await WriteFile(paths.blog, JSON.stringify(tree))
  await WriteFile(paths.status, JSON.stringify(status))
  await WriteFile(paths.acts, JSON.stringify(acts.slice(0, 50)))
  await WriteFile(paths.version, JSON.stringify(versionData))

  // check
  await checkJson(paths.blog)
  await checkJson(paths.status)
  await checkJson(paths.acts)
}

main().catch(console.log)
