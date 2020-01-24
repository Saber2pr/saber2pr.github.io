import { ReadFile, versionUp, WriteFile } from "./node"
import { paths } from "./paths"

type CacheType = "STATIC" | "DYNAMIC"
const matchType = <T extends (...args: any) => any>(
  type: CacheType,
  DYNAMIC: T,
  STATIC: T
): ReturnType<T> => {
  if (type === "DYNAMIC") {
    return DYNAMIC()
  }
  if (type === "STATIC") {
    return STATIC()
  }
}

export const updateVersion = async (type: CacheType) => {
  const versionData = await ReadFile(paths.version).then(b =>
    JSON.parse(b.toString())
  )

  matchType(
    type,
    () => {
      versionData.DYNAMIC_VERSION = versionUp(versionData.DYNAMIC_VERSION)
    },
    () => {
      versionData.STATIC_VERSION = versionUp(versionData.STATIC_VERSION)
    }
  )

  await WriteFile(paths.version, JSON.stringify(versionData))
}
