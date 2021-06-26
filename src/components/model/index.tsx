import './style.less'

import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { useUnMount } from '../../hooks'
import { checkIsMob } from '../../utils'

export interface Model {
  inner: JSX.Element
  onClickBg?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export type ModelAPI = {
  close: VoidFunction
  closeAnimated?: VoidFunction
  hide?: Function
  show?: Function
}

type ModelHelper = (message: (ModelAPI: ModelAPI) => JSX.Element) => void

export const Model = React.forwardRef<HTMLDivElement, Model>(
  ({ inner, onClickBg }: Model, ref) => (
    <div className="Model" onClick={onClickBg} ref={ref}>
      <div className="Model-Box" onClick={e => e.stopPropagation()}>
        {inner}
      </div>
    </div>
  )
) as React.ForwardRefExoticComponent<
  Model & React.RefAttributes<HTMLDivElement>
> & {
  alert: ModelHelper
  Hidable: (
    message: (ModelAPI: ModelAPI) => JSX.Element,
    onClickBg?: (ModelAPI: ModelAPI) => void
  ) => void
}

export const useModel = (
  Inner: JSX.Element
): [JSX.Element, (show?: boolean) => void] => {
  const [model, setModel] = useState(<></>)
  const ref = useRef<HTMLDivElement>()

  const open = () => {
    if (!ref.current) {
      const container = document.createElement('div')
      document.body.append(container)
      ref.current = container
    }
    setModel(
      ReactDOM.createPortal(
        <Model onClickBg={close} inner={Inner} />,
        ref.current
      )
    )
  }

  const close = () => setModel(<></>)

  useUnMount(() => ref.current && document.body.removeChild(ref.current))

  return [model, (show = true) => (show ? open() : close())]
}

Model.alert = message => {
  const container = document.createElement('div')
  document.body.append(container)

  const close = () =>
    ReactDOM.unmountComponentAtNode(container) &&
    document.body.removeChild(container)

  ReactDOM.render(
    <Model onClickBg={close} inner={message({ close })} />,
    container
  )
}

Model.Hidable = (
  message,
  onClickBg = ({ closeAnimated }) => closeAnimated()
) => {
  const container = document.createElement('div')
  document.body.append(container)
  const control_ref = React.createRef<HTMLDivElement>()

  const close = () =>
    ReactDOM.unmountComponentAtNode(container) &&
    document.body.removeChild(container)

  const hide = () => {
    control_ref.current.style.left = '-100%'
    control_ref.current.style.opacity = '0'
  }

  const show = () => {
    control_ref.current.style.left = '0'
    control_ref.current.style.opacity = '1'
  }

  ReactDOM.render(
    <Model
      onClickBg={() => {
        hide()
        onClickBg({
          close,
          hide,
          show,
          closeAnimated: () => setTimeout(() => close(), 1000),
        })
      }}
      ref={control_ref}
      inner={message({ close, hide, show })}
    />,
    container
  )
}

const createFrame = (html: string, close: Function) => {
  const { clientWidth, clientHeight } = document.documentElement
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const style = document.createElement('style')
  const isMob = checkIsMob()
  style.innerHTML = `body{padding-bottom:${
    isMob ? '40px' : '0px'
  };background-color:white}`
  doc.head.append(style)
  const ratio = isMob ? [0.9, 0.8] : [0.8, 0.8]
  return (
    <>
      <button
        className="ButtonHigh"
        onClick={() => close()}
        style={{
          position: 'absolute',
          ...(isMob
            ? {
                left: 8,
                bottom: 8,
              }
            : { top: 8, right: 8 }),
        }}
      >
        关闭
      </button>
      <iframe
        frameBorder="0"
        style={{
          borderRadius: 4,
        }}
        width={clientWidth * ratio[0]}
        height={clientHeight * ratio[1]}
        srcDoc={doc.documentElement.innerHTML}
      />
    </>
  )
}

export const requestFrameModal = async (src: string) => {
  LOADING.init()
  const html = await fetch(src).then(res => res.text())
  LOADING.destroy()
  Model.alert(({ close }) =>
    createFrame(html, () => {
      close()
      LOADING.destroy()
    })
  )
}
