import { request } from "../request"

export const PWAInstaller = async (cacheKey = "saber2pr-pwa") => {
  const registration = await navigator.serviceWorker.register(
    "/service-worker.js"
  )

  const { version } = await request("version")
  if (localStorage.getItem("sw_version") === version) return

  await caches.delete(cacheKey)
  await registration.update()

  localStorage.setItem("sw_version", version)
}
