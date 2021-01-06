import { origin } from '../config'
import { localStore } from '../store'
import { whenInDEV } from './whenInDEV'

const {
  STATIC_VERSION_KEY,
  DYNAMIC_VERSION_KEY,
  DATA_LOADED,
} = origin.constants
const WORKER_PATH = origin.workers.pwa

export type CacheType = 'STATIC' | 'DYNAMIC'
const matchType = <T extends (...args: any) => any>(
  type: CacheType,
  DYNAMIC: T,
  STATIC: T
): ReturnType<T> => {
  if (type === 'DYNAMIC') {
    return DYNAMIC()
  }
  if (type === 'STATIC') {
    return STATIC()
  }
}

export const freeCache = async (type: CacheType) => {
  await matchType(
    type,
    () => {
      localStore.removeItem(DYNAMIC_VERSION_KEY)
      localStore.removeItem(DATA_LOADED)
      return caches.delete(DYNAMIC_VERSION_KEY)
    },
    async () => {
      localStore.removeItem(STATIC_VERSION_KEY)
      localStore.removeItem(DATA_LOADED)

      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.unregister()
      }

      return caches.delete(STATIC_VERSION_KEY)
    }
  )
}

export const updateVersion = async (version: string, type: CacheType) =>
  matchType(
    type,
    () => localStore.setItem(DYNAMIC_VERSION_KEY, version),
    async () => {
      localStore.setItem(STATIC_VERSION_KEY, version)
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
      }
    }
  )

export const getVersion = (type: CacheType) =>
  matchType(
    type,
    () => localStore.getItem(DYNAMIC_VERSION_KEY),
    () => localStore.getItem(STATIC_VERSION_KEY)
  )

export const PWAInstaller = async () => {
  await navigator.serviceWorker.register(WORKER_PATH)
  if (whenInDEV()) {
    await freeCache('DYNAMIC')
    await freeCache('STATIC')
  }
}
