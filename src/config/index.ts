import { hashHistory, browserHistory } from "@saber2pr/router"
import MD_Theme from "@saber2pr/md2jsx/lib/theme/atom-dark"

export const history = hashHistory
export const md_theme = MD_Theme

export const origin = {
  dev: "http://localhost:8080",
  pro: "https://saber2pr.github.io",
  src: "/build/config.json"
}
