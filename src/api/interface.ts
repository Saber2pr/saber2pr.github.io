export interface IResponse<T = any> {
  status: number
  data: T
  message: string
}

export type IV = typeof returnCitySN & {
  date: number
  action: {
    type: string
    payload: string
  }
}
