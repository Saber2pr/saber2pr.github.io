import { axios } from '../request/axios'
import { ApiUrls } from './apiUrls'

export const get163Msg = async () => {
  const res = await axios.get<string>(ApiUrls.comments163)
  const text = res.data
  if (text) {
    return text.slice(0, text.indexOf('来自@'))
  }
}
