import { createTree } from "./createTree";
import { join } from "path";
import { WriteFile } from "./node";

async function main() {
  const tree = await createTree({ path: join(process.cwd(), "blog") });
  await WriteFile(join(process.cwd(), "data/blogs.json"), JSON.stringify(tree));
}

main().catch(console.log);
