import { join } from "path"
import { origin } from "../src/config/origin"

export const paths = {
  auth: join(process.cwd(), "/auth/auth.json"),
  username: origin.username,
  repo: origin.repo,
  blog: join(process.cwd(), origin.md),
  config_blog: join(process.cwd(), origin.data.blog),
  config_blog_update: join(process.cwd(), origin.data.activity),
  config_blog_status: join(process.cwd(), origin.data.status)
}
