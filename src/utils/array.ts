export const getArray = <T>(array: T[]) => (Array.isArray(array) ? array : [])
export const toArray = <T>(item: T | T[]) => ([] as T[]).concat(item)