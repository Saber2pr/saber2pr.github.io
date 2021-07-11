export const formatTimeStamp = (ts_ms: number) => {
  const date = new Date(Number(ts_ms))
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const formatTime = (time: string) =>
  `${time.slice(0, 4)}/${time.slice(4)}`
