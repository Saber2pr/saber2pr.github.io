import React from "react"
import "./style.less"
import {
  cleanUpdates,
  getUpdateOmit,
  setUpdateOmit,
  checkUpdate
} from "../check-update"
import { useBtnDisable } from "../../hooks"
import { useModel } from "../model"
import { getVersion } from "../../utils"

export interface Option {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  checkUpdate: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  clearCache: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Option = React.forwardRef<HTMLButtonElement, Option>(
  ({ onClose, checkUpdate, clearCache }: Option, ref) => {
    return (
      <>
        <div className="Option-Close" onClick={onClose}>
          <div />
          <div />
        </div>
        <div className="Option">
          <section>
            <div className="Option-Box">
              <div className="Option-Content">
                test
                <div className="Option-Version">版本号：v{getVersion()}</div>
              </div>
            </div>
          </section>
          <aside>
            <div className="Option-Box">
              <div className="Option-Content">
                <dl className="Option-List">
                  <dt>
                    <div className="Option-Title">选项</div>
                  </dt>
                  <dd>
                    <button
                      className="ButtonHigh"
                      ref={ref}
                      onClick={checkUpdate}
                    >
                      检查更新
                    </button>
                  </dd>
                  <dd>
                    <button className="ButtonHigh" onClick={clearCache}>
                      清除缓存
                    </button>
                  </dd>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </>
    )
  }
)

export const useOption = (): [JSX.Element, (show?: boolean) => void] => {
  const clearCache = () => {
    show(false)
    cleanUpdates()
  }

  const onCheckUpdate = () => {
    disable()
    const updateOmit = getUpdateOmit()
    setUpdateOmit("false")
    checkUpdate(() => {
      disable(false)
      setUpdateOmit(updateOmit)
    })
  }

  const [ref, disable] = useBtnDisable()

  const [model, show] = useModel(
    <Option
      ref={ref}
      onClose={() => show(false)}
      checkUpdate={onCheckUpdate}
      clearCache={clearCache}
    />
  )
  return [model, show]
}
