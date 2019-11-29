import React, { useState, useRef } from "react"
import ReactDOM from "react-dom"
import "./style.less"
import { useUnMount } from "../../hooks"

export interface Model {
  inner: JSX.Element
}

export const Model = ({ inner }: Model) => (
  <div className="Model">
    <div className="Model-Box">{inner}</div>
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
    setModel(ReactDOM.createPortal(<Model inner={Inner} />, ref.current))
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
  ReactDOM.render(
    <Model
      inner={message({
        close: () =>
          ReactDOM.unmountComponentAtNode(container) &&
          document.body.removeChild(container)
      })}
    />,
    container
  )
}
