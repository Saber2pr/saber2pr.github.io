declare const version: string

export const PWAInstaller = async (cacheKey = "saber2pr-pwa") => {
  const registration = await navigator.serviceWorker.register(
    "/service-worker.js"
  )

  if (localStorage.getItem("sw_version") === version) return

  await caches.delete(cacheKey)
  await registration.update()
  localStorage.setItem("sw_version", version)
}
