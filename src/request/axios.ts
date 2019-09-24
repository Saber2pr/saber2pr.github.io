import { Request } from "@saber2pr/request"
import { AccessToken } from "@saber2pr/rc-gitment"

export const axios = new Request({
  headers: {
    Authorization: `token ${AccessToken.checkAccess()}`
  }
})
