import { useState } from "react"

export const usePreComp = (comp: JSX.Element): [JSX.Element, VoidFunction] => {
  const [body, alter] = useState(comp)
  const destory = () => alter(null)
  return [body, destory]
}
