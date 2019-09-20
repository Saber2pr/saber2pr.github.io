import { ThemeStyleType, themeStyle } from "./styles"
import { getStyleConfiger } from "./getStyleConfiger"

let currentType: ThemeStyleType = "default"

export const getCurrentThemeType = () => currentType

export const selectTheme = (type: ThemeStyleType) => {
  const styleConfiger = getStyleConfiger()
  styleConfiger.href = themeStyle[type]
  currentType = type
}
