import { createTree } from "./createTree";
import { join } from "path";
import { WriteFile, Exists, MkDir } from "./node";
import { register } from "./register";

async function main() {
  const Dir = join(__dirname, "../build");
  const statu = await Exists(Dir);
  if (!statu) await MkDir(Dir);

  const tree = await createTree({ path: join(process.cwd(), "blog") });
  await WriteFile(join(process.cwd(), "data/blogs.json"), JSON.stringify(tree));
  await register();
}

main().catch(console.log);
