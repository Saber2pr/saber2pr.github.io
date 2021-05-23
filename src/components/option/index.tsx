declare const version: string

import './style.less'

import React from 'react'

import { useHistory } from '@saber2pr/react-router'

import { Routes } from '../../config'
import { useBtnDisable, useIsMob } from '../../hooks'
import { getVersion } from '../../utils'
import {
  checkUpdate,
  cleanUpdates,
  getUpdateOmit,
  setUpdateOmit,
} from '../check-update'
import { CloseBtn } from '../close-btn'
import { useModel } from '../model'
import { createMusicBox } from '../music-box'
import { WordsInputing } from '../words-inputing'

export interface Option {
  close: Function
  checkUpdate: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  clearCache: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Option = React.forwardRef<HTMLButtonElement, Option>(
  ({ close, checkUpdate, clearCache }: Option, ref) => {
    const history = useHistory()
    const isMob = useIsMob()
    return (
      <>
        <CloseBtn onClick={() => close()} />
        <div className="Option">
          <section>
            <div className="Option-Box">
              <div className="Option-Content">
                saber2pr.top [
                <a
                  className="AnchorHigh"
                  target="_blank"
                  href="https://whois.aliyun.com/whois/domain/saber2pr.top"
                >
                  whois
                </a>
                ]<div className="Option-Version">最后修改时间：{version}</div>
                <div className="Option-Version">
                  版本号(DYNAMIC)：v{getVersion('DYNAMIC')}
                  <br />
                  版本号(STATIC)：v{getVersion('STATIC')}
                </div>
                <div className="Option-Tip">
                  <WordsInputing
                    inputs={`秘密...${' '.repeat(8)}秘密基地被你发现了qaq！`}
                  />
                </div>
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
                  <dd>
                    <button
                      className="ButtonHigh"
                      onClick={() => {
                        createMusicBox()
                        close()
                      }}
                    >
                      音乐盒子
                    </button>
                  </dd>
                  <dd>
                    <button
                      className="ButtonHigh"
                      onClick={() => {
                        history.push(Routes.acg.href)
                        document.documentElement.scrollTop = 0
                      }}
                    >
                      ACG空间
                    </button>
                  </dd>
                  <dd>
                    <button
                      className="ButtonHigh"
                      onClick={() => {
                        window.open('https://gitee.com/saber2pr/saber2pr')
                      }}
                    >
                      镜像仓库
                    </button>
                  </dd>
                  {isMob && (
                    <dd>
                      <button
                        className="ButtonHigh"
                        onClick={() => {
                          history.push(Routes.datav.href)
                          document.documentElement.scrollTop = 0
                        }}
                      >
                        数据分析
                      </button>
                    </dd>
                  )}
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
    setUpdateOmit('false')
    checkUpdate(() => {
      disable(false)
      setUpdateOmit(updateOmit)
    })
  }

  const [ref, disable] = useBtnDisable()

  const [model, show] = useModel(
    <Option
      ref={ref}
      close={() => show(false)}
      checkUpdate={onCheckUpdate}
      clearCache={clearCache}
    />
  )
  return [model, show]
}
