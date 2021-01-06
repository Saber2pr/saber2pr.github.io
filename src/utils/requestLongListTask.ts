export const requestLongListTask = <T, R>(
  list: T[],
  req: (item: T) => Promise<R>,
  filter?: (item: T) => boolean,
  max = 6
) => {
  let task: Promise<R>[] = []
  let queue = Promise.all(task)
  const pustTask = (temp: Promise<R>[]) => {
    queue = queue.then(() => Promise.all(temp))
  }

  for (const item of list) {
    if (filter && !filter(item)) {
      continue
    }
    task.push(req(item))
    if (task.length === max) {
      pustTask(task)
      task = []
    }
  }
  if (task.length) {
    pustTask(task)
  }

  return queue
}
