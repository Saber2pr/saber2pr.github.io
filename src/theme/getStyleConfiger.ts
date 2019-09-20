export const getStyleConfiger = () => {
  const configer = document.head.getElementsByClassName(
    "theme"
  )[0] as HTMLLinkElement
  if (configer) {
    return configer
  } else {
    const newConfiger = document.createElement("link")
    newConfiger.rel = "stylesheet"
    newConfiger.className = "theme"
    document.head.append(newConfiger)
    return newConfiger
  }
}
