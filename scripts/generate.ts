import { join } from "path"
import { WriteFile, Exists, MkDir } from "./node"
import { createMenu } from "./createMenu"

import { parse, getAbsPath } from "@saber2pr/tree-lang"

const config_path = join(process.cwd(), "build/config.json")
const config_path_blog = join(process.cwd(), "build/config_blog")
const path_data = join(__dirname, "../data")

const paths = {
  about: join(path_data, "about.json"),
  home: join(path_data, "home.json"),
  links: join(path_data, "links.json"),
  projects: join(path_data, "projects.json"),
  blog: join(process.cwd(), "/blog")
}

type Config = {
  JHome: any
  JAbout: any
  JLinks: any
  JProject: any
  lastDate: any
}

async function main() {
  // root dir
  const Dir = join(__dirname, "../build")
  const statu = await Exists(Dir)
  if (!statu) await MkDir(Dir)

  // config
  const config_obj = {} as Config

  // register to config
  config_obj.JHome = require(paths.home)
  config_obj.JAbout = require(paths.about)
  config_obj.JLinks = require(paths.links)
  config_obj.JProject = require(paths.projects)

  config_obj.lastDate = new Date().toLocaleString()

  // save to config file
  await WriteFile(config_path, JSON.stringify(config_obj))

  // create blog menu
  const menu = await createBlogConfig(paths.blog)
  await WriteFile(config_path_blog, menu)
}

main().catch(console.log)

const createBlogConfig = async (root: string) =>
  await createMenu(root).then(text => {
    const lines = text.split("\n")
    lines.shift()
    return lines.map(l => l.slice(2)).join("\n")
  })
