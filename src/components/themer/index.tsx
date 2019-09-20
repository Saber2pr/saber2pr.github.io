import React, { useCallback, useState, useEffect } from "react"
import "./style.less"
import { getCurrentThemeType, selectTheme, testStyle } from "../../theme"
import { Icon } from "../../iconfont"
import { localStore } from "../../store"
import { ThemeStyleType } from "../../theme/styles"

export interface Themer {}

const useThemeSelector = (): [JSX.Element, () => void] => {
  const [view, display] = useState<JSX.Element>(<Icon.DarkTheme />)
  const localThemeCache = localStore.getItem("theme") as ThemeStyleType
  useEffect(() => {
    if (testStyle(localThemeCache)) {
      selectTheme(localThemeCache)
      if (localThemeCache === "dark") display(<Icon.DarkTheme />)
      if (localThemeCache === "light") display(<Icon.LightTheme />)
    } else {
      display(<Icon.LightTheme />)
    }
  }, [])

  const changeTheme = useCallback(() => {
    const type = getCurrentThemeType()
    if (type === "dark") {
      selectTheme("light")
      display(<Icon.LightTheme />)
      localStore.setItem("theme", "light")
    }
    if (type === "light") {
      selectTheme("dark")
      display(<Icon.DarkTheme />)
      localStore.setItem("theme", "dark")
    }
  }, [])
  return [view, changeTheme]
}

export const Themer = ({  }: Themer) => {
  const [view, changeTheme] = useThemeSelector()
  return (
    <span className="Themer" onClick={changeTheme}>
      {view}
    </span>
  )
}
