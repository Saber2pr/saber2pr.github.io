export const splitArray = <T>(
  array: T[],
  interval = 4,
  filter?: (item: T) => boolean
) => {
  const result: T[][] = []
  let temp: T[] = []
  for (const item of array) {
    if (filter && !filter(item)) {
      continue
    }
    temp.push(item)
    if (temp.length === interval) {
      result.push(temp)
      temp = []
    }
  }
  if (temp.length) {
    result.push(temp)
  }

  return result
}

export const getArray = <T>(array: T[]) => (Array.isArray(array) ? array : [])
