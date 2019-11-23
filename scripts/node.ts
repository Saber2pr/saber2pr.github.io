import { promisify } from "util"
import { readdir, readFile, stat, exists, mkdir, writeFile } from "fs"
import https from "https"
import { URL } from "url"
import { OutgoingHttpHeaders } from "http"
import { Terminal } from "@saber2pr/node"

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

export const fetch = ({
  path,
  headers
}: {
  path: string
  headers: OutgoingHttpHeaders
}) =>
  new Promise<string>((resolve, reject) => {
    const url = new URL(encodeURI(path))
    https.get(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers
      },
      res => {
        const data = []
        const handle = setTimeout(() => reject(""), 10000)
        res
          .on("data", chunk => data.push(chunk.toString()))
          .on("end", () => {
            resolve(data.join(""))
            clearTimeout(handle)
          })
          .on("error", reject)
      }
    )
  })

export const displayProgress = (max: number) => {
  let index = 0
  return () => {
    Terminal.success(
      `[Progress]: ...${Number((index * 100) / max).toFixed(1)}%`
    )
    index++
  }
}

export const versionUp = (version: string) =>
  String(Number(version.split(".").join("")) + 1)
    .padStart(3, "0")
    .split("")
    .join(".")
