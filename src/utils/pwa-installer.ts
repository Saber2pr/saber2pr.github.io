import { request } from "../request"

let _cacheKey: string
export const freeCache = () => {
  localStorage.removeItem("sw_version")
  if (_cacheKey) {
    return caches.delete(_cacheKey)
  } else {
    return Promise.reject()
  }
}

let _version = "未知"
export const getVersion = () => _version

export const PWAInstaller = async (cacheKey = "saber2pr-pwa") => {
  _cacheKey = cacheKey
  const registration = await navigator.serviceWorker.register(
    "/service-worker.js"
  )

  const { version } = await request("version")
  _version = version
  if (localStorage.getItem("sw_version") === version) return

  await freeCache()
  await registration.update()

  localStorage.setItem("sw_version", version)
}
