import { splitArray } from './array'

export const requestLongListTask = <T>(
  list: T[],
  req: (item: T) => Promise<any>,
  max = 6
) =>
  setTimeout(() =>
    splitArray(list, max).reduce(
      (queue, list) => queue.then(() => Promise.all(list.map(req))),
      Promise.resolve()
    )
  )
