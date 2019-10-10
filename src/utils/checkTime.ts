export const checkDarkTime = () => {
  const hour = new Date().getHours()
  return hour < 6 || hour > 18
}

export const checkDarknessTime = () => {
  const hour = new Date().getHours()
  return hour < 6 || hour > 24
}
