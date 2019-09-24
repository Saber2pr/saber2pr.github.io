import { join } from "path"
import { WriteFile, Exists, MkDir } from "./node"
import { createMenu } from "./createMenu"

const config_path_blog = join(process.cwd(), "build/config_blog")

const paths = {
  blog: join(process.cwd(), "/blog")
}

async function main() {
  // root dir
  const Dir = join(__dirname, "../build")
  const statu = await Exists(Dir)
  if (!statu) await MkDir(Dir)

  // create blog menu
  const menu = await createBlogConfig(paths.blog)
  await WriteFile(config_path_blog, menu)
}

main().catch(console.log)

const createBlogConfig = async (root: string) =>
  await createMenu(root).then(text => {
    const lines = text.split("\n")
    lines.shift()
    return lines.map(l => l.slice(2)).join("\n")
  })
