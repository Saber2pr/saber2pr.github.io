import { splitArray } from './array'

export const requestLongListTask = <T>(
  list: T[],
  req: (item: T) => Promise<any>,
  filter?: (item: T) => boolean,
  max = 6
) =>
  setTimeout(() =>
    splitArray(list, max, filter).reduce(
      (queue, list) => queue.then(() => Promise.all(list.map(req))),
      Promise.resolve()
    )
  )
