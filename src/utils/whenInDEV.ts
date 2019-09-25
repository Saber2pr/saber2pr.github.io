export const whenInDEV = (callback: Function) => {
  if (process.env.NODE_ENV === "development") {
    callback()
  }
}
