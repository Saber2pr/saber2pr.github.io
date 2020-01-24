import React from "react"
import "./style.less"
import {
  freeCache,
  whenInDEV,
  timeout,
  getVersion,
  updateVersion,
  CacheType,
  checkNetwork
} from "../../utils"
import { origin } from "../../config"
import { Model } from "../model"
import { localStore } from "../../store"

let LOCK = false

export interface CheckUpdate {
  version: string
  close: Function
  option: boolean
  mode: CacheType
}

const { UPDATE_OMIT_KEY } = origin.constants
export const setUpdateOmit = (value: string) =>
  localStore.setItem(UPDATE_OMIT_KEY, value)
export const getUpdateOmit = () =>
  localStore.getItem(UPDATE_OMIT_KEY) || "false"
const shouldUpdateOmit = () => getUpdateOmit() === "true"

export const CheckUpdate = ({ version, close, option, mode }: CheckUpdate) => {
  return (
    <div className="CheckUpdate">
      <div className="CheckUpdate-Title">
        有新的版本v{version}({mode})，是否立即更新？
      </div>
      <button
        className="ButtonHigh"
        onClick={async () => {
          await freeCache(mode)
          await updateVersion(version, mode)
          setUpdateOmit("false")
          location.reload()
        }}
      >
        确定
      </button>
      <span className="Block" />
      <button
        className="ButtonHigh"
        onClick={() => {
          close()
          LOCK = false
        }}
      >
        取消
      </button>
      {option && (
        <div className="CheckUpdate-Omit">
          <input
            type="checkbox"
            onInput={e => setUpdateOmit(e.target["checked"])}
            id="omit"
          />
          <label htmlFor="omit">不再提醒</label>
        </div>
      )}
    </div>
  )
}

type UpdateMode = CacheType | "INIT_STATIC" | "INIT_DYNAMIC" | "NONE"

const getUpdateMode = (version: any): UpdateMode => {
  const STATIC_VERSION = getVersion("STATIC")
  const DYNAMIC_VERSION = getVersion("DYNAMIC")

  if (STATIC_VERSION === null) {
    return "INIT_STATIC"
  }

  if (DYNAMIC_VERSION === null) {
    return "INIT_DYNAMIC"
  }

  if (version.STATIC_VERSION !== STATIC_VERSION) {
    return "STATIC"
  }
  if (version.DYNAMIC_VERSION !== DYNAMIC_VERSION) {
    return "DYNAMIC"
  }

  return "NONE"
}

type Version = { DYNAMIC_VERSION: string; STATIC_VERSION: string }

export const checkUpdate = (callback?: () => void, canOmit = false) => {
  if (!checkNetwork()) {
    Model.alert(({ close }) => {
      setTimeout(() => {
        close()
        callback && callback()
      }, 1000)
      return (
        <p className="Alert-Message" onClick={close}>
          无网络连接！
        </p>
      )
    })

    return
  }

  if (LOCK) return
  if (shouldUpdateOmit()) return
  fetch(origin.data.version)
    .then(async res => {
      if (whenInDEV()) {
        await timeout()
      }
      return res.json() as Promise<Version>
    })
    .then(async version => {
      callback && callback()
      const updateMode = getUpdateMode(version)

      if (updateMode === "NONE") {
        if (canOmit) return
        Model.alert(({ close }) => {
          setTimeout(() => {
            close()
            LOCK = false
          }, 1000)
          return (
            <p className="Alert-Message" onClick={close}>
              已经是最新版
            </p>
          )
        })
      } else if (updateMode === "INIT_STATIC") {
        await updateVersion(version.STATIC_VERSION, "STATIC")
      } else if (updateMode === "INIT_DYNAMIC") {
        await updateVersion(version.DYNAMIC_VERSION, "DYNAMIC")
      } else {
        Model.alert(({ close }) => (
          <CheckUpdate
            version={
              updateMode === "STATIC"
                ? version.STATIC_VERSION
                : version.DYNAMIC_VERSION
            }
            mode={updateMode}
            close={close}
            option={canOmit}
          />
        ))
      }
      LOCK = true
    })
}

export const cleanUpdates = async () => {
  await freeCache("DYNAMIC")
  await freeCache("STATIC")
  Model.alert(({ close }) => {
    setTimeout(close, 1000)
    return (
      <p className="Alert-Message" onClick={close}>
        清除成功
      </p>
    )
  })
}
