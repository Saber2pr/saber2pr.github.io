export const verPath = (p: string) => p.replace(/\\/g, '/')
export const isSamePath = (p1: string, p2: string) =>
  verPath(p1) === verPath(p2)
