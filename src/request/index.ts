import { origin_dev, origin_pro, origin_src } from "../config"

export const request = async () => {
  if (process.env.NODE_ENV === "development") {
    origin = origin_dev + origin_src
  } else if (process.env.NODE_ENV === "production") {
    origin = origin_pro + origin_src
  }
  const data = await fetch(origin)
  return data.json()
}
