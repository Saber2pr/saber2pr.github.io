import React from "react"
import "./style.less"
import {
  freeCache,
  whenInDEV,
  timeout,
  getVersion,
  updateVersion
} from "../../utils"
import { origin } from "../../config"
import { Model } from "../model"
import { localStore } from "../../store"

let LOCK = false

export interface CheckUpdate {
  version: string
  close: Function
  option: boolean
}

const { UPDATE_OMIT_KEY } = origin.constants
export const setUpdateOmit = (value: string) =>
  localStore.setItem(UPDATE_OMIT_KEY, value)
export const getUpdateOmit = () =>
  localStore.getItem(UPDATE_OMIT_KEY) || "false"
const shouldUpdateOmit = () => getUpdateOmit() === "true"

export const CheckUpdate = ({ version, close, option }: CheckUpdate) => {
  return (
    <div className="CheckUpdate">
      <div className="CheckUpdate-Title">
        有新的版本(v{version})，是否立即更新？
      </div>
      <button
        className="ButtonHigh"
        onClick={async () => {
          await freeCache()
          await updateVersion(version)
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

export const checkUpdate = (
  callback?: (version: string, isSameVersion: boolean) => void,
  canOmit = false
) => {
  if (LOCK) return
  if (shouldUpdateOmit()) return
  fetch(origin.data.version)
    .then(async res => {
      if (whenInDEV()) {
        await timeout()
      }
      return res.json()
    })
    .then(({ version }) => {
      const isSameVersion = version === getVersion()
      callback && callback(version, isSameVersion)
      if (isSameVersion) {
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
      } else {
        Model.alert(({ close }) => (
          <CheckUpdate version={version} close={close} option={canOmit} />
        ))
      }
      LOCK = true
    })
}

export const cleanUpdates = () =>
  freeCache().then(() =>
    Model.alert(({ close }) => {
      setTimeout(close, 1000)
      return (
        <p className="Alert-Message" onClick={close}>
          清除成功
        </p>
      )
    })
  )
