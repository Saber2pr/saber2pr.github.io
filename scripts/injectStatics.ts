import { paths } from "./paths"
import { ReadFile, ReadDir, WriteFile } from "./node"
import { join } from "path"

const CODE_START = `/** CODE START **/`
const CODE_END = `/** CODE END **/`

const getMid = (str: string) => str.slice(1, str.length - 1)

const injectStatics = async () => {
  const workerSrc = await ReadFile(paths.pwa_worker).then(b => b.toString())

  let statics = await ReadDir(paths.publicPath)
  statics = statics.reduce((acc, src) => {
    if (src === "index.html") return acc
    return acc.concat(join(paths.publicBase, src))
  }, [])

  const insertStart = workerSrc.indexOf(CODE_START) + CODE_START.length
  const insertEnd = workerSrc.indexOf(CODE_END)

  const content = getMid(JSON.stringify(statics))

  const result =
    workerSrc.slice(0, insertStart) + content + workerSrc.slice(insertEnd)

  await WriteFile(paths.pwa_worker, result)
}

injectStatics()
