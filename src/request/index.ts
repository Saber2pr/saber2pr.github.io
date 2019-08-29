let origin_dev = "http://localhost:8080"
let origin_pro = "https://saber2pr.github.io"
const src = "/data/config.json"

export const request = async () => {
  if (process.env.NODE_ENV === "development") {
    origin = origin_dev + src
  } else if (process.env.NODE_ENV === "production") {
    origin = origin_pro + src
  }
  const data = await fetch(origin)
  return data.json()
}
