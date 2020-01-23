import React from "react"
import ReactDOM from "react-dom"

import "normalize.css"

import "animate.css/source/flippers/flipInX.css"

import "./style/animation.less"
import "./style/shadow.less"
import "./style/components.less"

// /

import Pages from "./app"
import { Loading, ErrorBoundary, checkUpdate } from "./components"
import { welcome, PWAInstaller, whenInDEV } from "./utils"
import { request } from "./request"

const App = React.lazy(async () => {
  welcome()
  const homeInfo = await request("home")
  const aboutInfo = await request("about")
  const blogTree = await request("blog")
  return {
    default: () => (
      <Pages homeInfo={homeInfo} aboutInfo={aboutInfo} blogTree={blogTree} />
    )
  }
})

ReactDOM.render(
  <ErrorBoundary>
    <React.Suspense fallback={<Loading />}>
      <App />
    </React.Suspense>
  </ErrorBoundary>,
  document.getElementById("root")
)

window.addEventListener("load", async () => {
  if (whenInDEV()) return

  if ("serviceWorker" in navigator) {
    await PWAInstaller()
    checkUpdate(null, true)
  }
})
