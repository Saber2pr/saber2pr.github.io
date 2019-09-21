export const timeDelta = (time1: string, time2: string) => {
  console.log(time1, time2)
  const Time1 = new Date(time1).getTime()
  const Time2 = new Date(time2).getTime()

  const seconds = (Time1 - Time2) / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30
  const years = months / 12

  if (years >= 1) return `${Math.round(years)} years ago.`
  if (months >= 1) return `${Math.round(months)} months ago.`
  if (days >= 1) return `${Math.round(days)} days ago.`
  if (hours >= 1) return `${Math.round(hours)} hours ago.`
  if (minutes >= 1) return `${Math.round(minutes)} minutes ago.`
  if (seconds >= 1) return `${Math.round(minutes)} seconds ago.`
}
