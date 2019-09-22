import { AccessCode } from "@saber2pr/rc-gitment"
import { origin } from "../config"

export const interceptor = (res: Response) => {
  if (res.status === 401) {
    location.href = AccessCode.createCodeUrl(origin.client_id)
  }
  return res
}
