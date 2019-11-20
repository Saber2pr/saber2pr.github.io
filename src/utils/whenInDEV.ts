export const whenInDEV = (callback?: Function) => {
  const __DEV__ = process.env.NODE_ENV === "development"
  __DEV__ && callback && callback()
  return __DEV__
}
