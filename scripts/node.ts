import { promisify } from "util"
import { readdir, readFile, stat, exists, mkdir, writeFile } from "fs"

export const ReadDir = promisify(readdir)
export const ReadFile = promisify(readFile)
export const Stat = promisify(stat)
export const Exists = promisify(exists)
export const MkDir = promisify(mkdir)
export const WriteFile = promisify(writeFile)

export const InsertBeforeFile = async (path: string, content: string) => {
  const text = await ReadFile(path).then(b => b.toString())
  await WriteFile(path, text + content)
}

export namespace Print {
  export const error = (message: string) =>
    console.log(`\u001b[31m${message}\u001b[37m`)
  export const success = (message: string) =>
    console.log(`\u001b[32m${message}\u001b[37m`)
  export const tips = (message: string) =>
    console.log(`\u001b[34m${message}\u001b[37m`)
  export const notice = (message: string) =>
    console.log(`\u001b[33m${message}\u001b[33m`)
}

export const copy = (from: string, to: string) =>
  ReadFile(from).then(buffer => WriteFile(to, buffer))
