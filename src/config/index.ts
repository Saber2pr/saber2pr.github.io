declare const client_id: string
declare const client_secret: string

export * from "./browser"
export * from "./origin"
import { origin } from "./origin"

origin["client_id"] = client_id
origin["client_secret"] = client_secret

const Routes = {
  home: {
    href: "/",
    name: "saber2pr"
  },
  about: {
    href: "/关于",
    name: "关于"
  },
  acts: {
    href: "/动态",
    name: "动态"
  },
  blog: {
    name: "博客",
    href: "/blog"
  },
  learn: {
    href: "/文档",
    name: "文档"
  },
  links: {
    href: "/链接",
    name: "链接"
  },
  search: {
    href: "/搜索结果"
  },
  secret: {
    href: "/secret"
  },
  notFound: {
    href: "*"
  }
}

export { origin, Routes }
