import { parse, join } from "path"
import { exec } from "child_process"
import { promisify } from "util"
import { paths } from "./paths"

const inherit = (path: string) => {
  const { dir, name } = parse(path)
  const target = join(dir, `__${name}__`)
  return promisify(exec)(`cp -r ${path} ${target}`)
}

inherit(paths.md)
