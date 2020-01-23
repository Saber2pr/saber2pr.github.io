import { join } from "path"
import { origin } from "../src/config/origin"

export const paths = {
  auth: join(process.cwd(), "/auth/auth.json"),
  username: origin.userId,
  repo: origin.repo,
  md: join(process.cwd(), origin.md),
  blog: join(process.cwd(), origin.data.blog),
  status: join(process.cwd(), "/scripts/temp/blog_status.json"),
  acts: join(process.cwd(), origin.data.activity),
  version: join(process.cwd(), origin.data.version),
  pwa_worker: join(process.cwd(), origin.workers.pwa),
  publicPath: join(process.cwd(), "build"),
  publicBase: "/build"
}
