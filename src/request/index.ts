import { origin } from "../config"

export const request = async () => {
  const url = origin.root + origin.data
  const data = await fetch(url)
  return data.json()
}

export namespace API {
  export const createAvatars = (name: string, size = 70) =>
    `https://avatars.githubusercontent.com/${name}?size=${size}`
}
