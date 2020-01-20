import React, { useState, useRef } from "react"
import ReactDOM from "react-dom"
import "./style.less"
import { useUnMount } from "../../hooks"

export interface Model {
  inner: JSX.Element
  onClickBg?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Model = ({ inner, onClickBg }: Model) => (
  <div className="Model" onClick={onClickBg}>
    <div className="Model-Box" onClick={e => e.stopPropagation()}>
      {inner}
    </div>
  </div>
)

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

export type ModelAPI = {
  close: VoidFunction
}

Model.alert = (message: (ModelAPI: ModelAPI) => JSX.Element) => {
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
