export const createUpdate = (type: string, content: string) =>
  `${type}&${content}&${new Date().toLocaleString()}`
