import { origin } from "../config"
import { localStore } from "../store"
import { whenInDEV } from "./whenInDEV"

const { VERSION_KEY, PWA_KEY } = origin.constants
const WORKER_PATH = origin.workers.pwa

export const freeCache = async () => {
  localStore.clear()
  await caches.delete(PWA_KEY)
  const registration = await navigator.serviceWorker.getRegistration()
  await registration.unregister()
}

export const updateVersion = async (version: string) => {
  localStore.setItem(VERSION_KEY, version)
  const registration = await navigator.serviceWorker.getRegistration()
  await registration.update()
}

export const getVersion = () => localStore.getItem(VERSION_KEY)

export const PWAInstaller = async () => {
  await navigator.serviceWorker.register(WORKER_PATH)
  if (whenInDEV()) {
    await caches.delete(PWA_KEY)
  }
}
