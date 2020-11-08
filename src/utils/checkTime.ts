export const checkDarkTime = () => {
  const hour = new Date().getHours()
  return hour < 6 || hour > 18
}

export const checkDarknessTime = () => {
  const hour = new Date().getHours()
  return hour < 6 || hour > 24
}

export const getTimeMessage = () => {
  const hour = new Date().getHours()
  if (hour < 6) {
    return '不要熬夜哦~身体健康最重要~'
  }

  if (hour < 12) {
    return '早上好~新的一天也要努力~'
  }

  if (hour < 13) {
    return '中午好~吃过饭了吗~'
  }

  if (hour < 18) {
    return '下午好~'
  }

  if (hour <= 21) {
    return '晚上好~马上进入夜晚了哦...'
  }

  if (hour <= 24) {
    return '已经很晚了...'
  }
}
