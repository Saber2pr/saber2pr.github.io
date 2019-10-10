import { Terminal, FS } from "@saber2pr/node"
import { createUpdate } from "./createUpdate"
import { addUpdateStringToFile } from "./collectUpdates"
import { paths } from "./paths"
import { ReadFile } from "./node"

export async function createIdeaFromFile() {
  Terminal.tips("--创建想法--")
  const path = await Terminal.getUserInput("导入文件路径：")
  const content = await ReadFile(path).then(b => b.toString())
  if (content.includes(";")) {
    throw new TypeError("includes `;`")
  }
  const newUpdate = createUpdate("想法", content)
  await addUpdateStringToFile(paths.config_blog_update, newUpdate)
  await FS.unlink(path)
}

createIdeaFromFile().catch(console.log)
