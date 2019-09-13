import { origin } from "../config"

export const request = async () => {
  let url: string
  if (process.env.NODE_ENV === "development") {
    url = origin.dev + origin.src
  } else if (process.env.NODE_ENV === "production") {
    url = origin.pro + origin.src
  }
  const data = await fetch(url)
  return data.json()
}
