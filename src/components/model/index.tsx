import React, { useState, useRef } from "react"
import ReactDOM from "react-dom"
import "./style.less"
import { useUnMount } from "../../hooks"

export interface Model {
  inner: JSX.Element
  onClickBg?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export type ModelAPI = {
  close: VoidFunction
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
      const container = document.createElement("div")
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
  const container = document.createElement("div")
  document.body.append(container)

  const close = () =>
    ReactDOM.unmountComponentAtNode(container) &&
    document.body.removeChild(container)

  ReactDOM.render(
    <Model onClickBg={close} inner={message({ close })} />,
    container
  )
}

Model.Hidable = (message, onClickBg) => {
  const container = document.createElement("div")
  document.body.append(container)
  const control_ref = React.createRef<HTMLDivElement>()

  const close = () =>
    ReactDOM.unmountComponentAtNode(container) &&
    document.body.removeChild(container)

  const hide = () => {
    control_ref.current.style.left = "-100%"
    control_ref.current.style.opacity = "0"
  }

  const show = () => {
    control_ref.current.style.left = "0"
    control_ref.current.style.opacity = "1"
  }

  ReactDOM.render(
    <Model
      onClickBg={() => {
        hide()
        onClickBg({ close, hide, show })
      }}
      ref={control_ref}
      inner={message({ close, hide, show })}
    />,
    container
  )
}
