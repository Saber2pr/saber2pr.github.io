import { createTree } from "./createTree"
import { join } from "path"
import { WriteFile, Exists, MkDir } from "./node"

const config_path = join(process.cwd(), "build/config.json")
const path_data = join(__dirname, "../data")

const paths = {
  about: join(path_data, "about.json"),
  home: join(path_data, "home.json"),
  links: join(path_data, "links.json"),
  projects: join(path_data, "projects.json")
}

type Config = {
  JBlog: any
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

  // parse markdown
  const tree = await createTree({ path: join(process.cwd(), "blog") })

  // config
  const config_obj = {} as Config

  // register to config
  config_obj.JBlog = tree
  config_obj.JHome = require(paths.home)
  config_obj.JAbout = require(paths.about)
  config_obj.JLinks = require(paths.links)
  config_obj.JProject = require(paths.projects)

  config_obj.lastDate = new Date().toLocaleString()

  // save to config file
  await WriteFile(config_path, JSON.stringify(config_obj))
}

main().catch(console.log)
