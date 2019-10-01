import { Terminal } from "@saber2pr/node"
import { createUpdate } from "./createUpdate"
import { addUpdateStringToFile } from "./collectUpdates"
import { paths } from "./paths"

async function createIdea() {
  Terminal.tips("--创建想法--")
  const type = (await Terminal.getUserInput("类型(想法):")) || "想法"
  const content = await Terminal.getUserInput("内容:")
  const newUpdate = createUpdate(type, content)
  await addUpdateStringToFile(paths.config_blog_update, newUpdate)
}

createIdea().catch(console.log)
