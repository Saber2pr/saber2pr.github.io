import { WriteFile } from "./node"
import { createMenu } from "./createMenu"
import {
  collectUpdates,
  addUpdateStringToFile,
  stringifyUpdates
} from "./collectUpdates"
import { paths } from "./paths"
import { Status, createStatusTree } from "./createStatusTree"
import { checkJson } from "./checkJson"

const createBlogConfig = async (root: string) =>
  await createMenu(root).then(text => {
    const lines = text.split("\n")
    lines.shift()
    return lines.map(l => l.slice(2)).join("\n")
  })

async function main() {
  // create blog menu
  const menu = await createBlogConfig(paths.blog)
  await WriteFile(paths.config_blog, menu)

  // create status tree
  await createStatusTree()

  // create blog updates
  const updates = await collectUpdates(paths.blog)

  // update status tree
  await Promise.all(
    updates.map(({ path, date }) => Status.update("LastModified", path, date))
  )

  // update blog updates
  await addUpdateStringToFile(
    paths.config_blog_update,
    stringifyUpdates(updates)
  )

  // check json
  await checkJson(paths.config_blog_status)
}

main().catch(console.log)
