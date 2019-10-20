import { WriteFile, ReadFile } from "./node"
import { join } from "path"
import { collect } from "./createTree"

async function main() {
  const json = await ReadFile(
    join(process.cwd(), "/static/data/blog_status.json")
  ).then(s => JSON.parse(s.toString()))
  const nodes = collect(json)
  await WriteFile("./test.json", JSON.stringify(nodes))
}

main()
