import { axios } from '../request/axios'
import { ApiUrls } from './apiUrls'
import { IV } from './interface'

const disableIV = localStorage.getItem('__disable_iv__')

export const pushIV = (action: IV['action']) => {
  if (disableIV) return
  if (typeof returnCitySN !== 'undefined') {
    const data: IV = {
      ...returnCitySN,
      date: Date.now(),
      action,
    }
    axios.post(ApiUrls.v, {
      params: data,
    })
  }
}
