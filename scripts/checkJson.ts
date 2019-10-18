import { ReadFile } from "./node"

export const checkJson = async (file: string) =>
  JSON.parse(await ReadFile(file).then(b => b.toString()))
