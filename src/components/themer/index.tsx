import React, { useCallback, useState, useEffect } from "react"
import "./style.less"
import { getCurrentThemeType, selectTheme } from "../../theme"
import { Icon } from "../../iconfont"
import { localStore } from "../../store"
import { ThemeStyleType } from "../../theme/styles"

export interface Themer {}

const useThemeSelector = (): [JSX.Element, () => void] => {
  const [view, display] = useState<JSX.Element>(<Icon.DarkTheme />)
  const localThemeCache = localStore.getItem("theme") as ThemeStyleType
  useEffect(() => {
    if (localThemeCache === "dark") {
      selectTheme("dark")
      display(<Icon.LightTheme />)
    }
    if (localThemeCache === "default") {
      selectTheme("default")
      display(<Icon.DarkTheme />)
    }
  }, [localThemeCache])

  const themeSelector = (type: ThemeStyleType, local = true) => {
    if (type === "dark") {
      selectTheme("default")
      display(<Icon.DarkTheme />)
      local && localStore.setItem("theme", "default")
    }
    if (type === "default") {
      selectTheme("dark")
      display(<Icon.LightTheme />)
      local && localStore.setItem("theme", "dark")
    }
  }
  const changeTheme = useCallback(() => {
    themeSelector(getCurrentThemeType())
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
