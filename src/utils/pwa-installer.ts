declare const version: string

export const PWAInstaller = async () => {
  const registration = await navigator.serviceWorker.register(
    "/service-worker.js"
  )

  if (localStorage.getItem("sw_version") === version) return

  await registration.update()
  localStorage.setItem("sw_version", version)
}
