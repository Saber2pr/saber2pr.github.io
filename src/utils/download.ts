export const download = (name: string, content: string) => {
  const a = document.createElement('a')
  const blob = new Blob([content])
  a.download = name
  a.href = URL.createObjectURL(blob)
  a.click()
}