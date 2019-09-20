import { ThemeStyleType, themeStyle } from "./styles"
import { getStyleConfiger } from "./getStyleConfiger"

let currentType: ThemeStyleType = "light"

export const getCurrentThemeType = () => currentType

export const selectTheme = (type: ThemeStyleType) => {
  const styleConfiger = getStyleConfiger()
  styleConfiger.href = themeStyle[type]
  currentType = type
}

export const testStyle = (type: any): type is ThemeStyleType =>
  (["light", "dark"] as ThemeStyleType[]).includes(type)
