declare const client_id: string
declare const client_secret: string

export * from "./browser"
export * from "./origin"
import { origin } from "./origin"

origin["client_id"] = client_id
origin["client_secret"] = client_secret

export { origin }
