import { join } from "path"

export const paths = {
  blog: join(process.cwd(), "/blog"),
  config_blog: join(process.cwd(), "config/blog"),
  config_blog_update: join(process.cwd(), "config/blog_update")
}
