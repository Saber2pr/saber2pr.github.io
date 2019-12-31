export const whenInDEV = async (callback?: Function) => {
  const __DEV__ = process.env.NODE_ENV === "development"
  __DEV__ && callback && (await callback())
  return __DEV__
}
