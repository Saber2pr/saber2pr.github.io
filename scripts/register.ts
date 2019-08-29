import { join } from "path"
import { copy, WriteFile, ReadFile } from "./node"

const template = {
  js: join(__dirname, "../template/bundle.min.js"),
  html: join(__dirname, "../template/index.html"),
  css: join(__dirname, "../template/style.min.css")
}

const output = {
  js: join(__dirname, "../build/bundle.min.js"),
  html: join(__dirname, "../build/index.html"),
  css: join(__dirname, "../build/style.min.css")
}

export async function register() {
  const dt = new Date().toLocaleString()
  const config = `var lastDate="${dt}"`

  await copy(template.html, output.html)
  await copy(template.css, output.css)

  const templateJS = await ReadFile(template.js).then(b => b.toString())
  const bundleJS = `${config};${templateJS}`
  await WriteFile(output.js, bundleJS)
}
