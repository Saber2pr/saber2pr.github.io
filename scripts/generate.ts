import { createTree } from "./createTree"
import { join } from "path"
import { WriteFile, Exists, MkDir, ReadFile } from "./node"

async function main() {
  const Dir = join(__dirname, "../build")
  const statu = await Exists(Dir)
  if (!statu) await MkDir(Dir)

  const tree = await createTree({ path: join(process.cwd(), "blog") })

  const config_path = join(process.cwd(), "data/config.json")
  const config = await ReadFile(config_path).then(b => b.toString())
  const config_obj = JSON.parse(config)

  config_obj.JBlog = tree

  config_obj.lastDate = new Date().toLocaleString()

  await WriteFile(config_path, JSON.stringify(config_obj))
}

main().catch(console.log)
