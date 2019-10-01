import { WriteFile } from "./node"
import { createMenu } from "./createMenu"
import { collectUpdates, addUpdateStringToFile } from "./collectUpdates"
import { paths } from "./paths"

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
  // create blog updates
  const update = await collectUpdates(paths.blog)
  await addUpdateStringToFile(paths.config_blog_update, update)
}

main().catch(console.log)
