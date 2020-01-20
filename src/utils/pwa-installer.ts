import { origin } from "../config"
import { localStore } from "../store"
import { whenInDEV } from "./whenInDEV"

const { VERSION_KEY, PWA_KEY } = origin.constants
const WORKER_PATH = origin.workers.pwa

export const freeCache = async () => {
  await caches.delete(PWA_KEY)
  localStore.clear()
}

export const updateVersion = async (version: string) => {
  const registration = await navigator.serviceWorker.register(WORKER_PATH)
  await registration.update()
  localStore.setItem(VERSION_KEY, version)
}

export const getVersion = () => localStore.getItem(VERSION_KEY)

export const PWAInstaller = async () => {
  await navigator.serviceWorker.register(WORKER_PATH)
  if (whenInDEV()) {
    await caches.delete(PWA_KEY)
  }
}
