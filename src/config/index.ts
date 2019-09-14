import { hashHistory, browserHistory } from "@saber2pr/router"
import MD_Theme from "@saber2pr/md2jsx/lib/theme/atom-dark"

export const history = hashHistory
export const md_theme = MD_Theme

export const origin = {
  root: null,
  data: "/build/config.json",
  md: "/blog",
  repo: "https://github.com/Saber2pr/saber2pr.github.io/blob/master"
}

if (!origin.root) {
  if (process.env.NODE_ENV === "development") {
    origin.root = "http://localhost:8080"
  } else if (process.env.NODE_ENV === "production") {
    origin.root = "https://saber2pr.github.io"
  }
}
