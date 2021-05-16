import memo from '@saber2pr/memo'
import { Request } from '@saber2pr/request'

export const axios = new Request({ timeout: 3600000 })

export const memoGet = memo(axios.get, axios, 20)
