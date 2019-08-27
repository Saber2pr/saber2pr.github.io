import React from "react"
import ReactDOM from "react-dom"

import Pages from "./app"
import { Loading } from "./components"
import { timeout } from "./utils"

import "normalize.css"

import "animate.css/source/_base.css"

import "animate.css/source/fading_entrances/fadeIn.css"
import "animate.css/source/fading_entrances/fadeInUp.css"

import "animate.css/source/bouncing_entrances/bounceInDown.css"
import "animate.css/source/bouncing_entrances/bounceInRight.css"

import "animate.css/source/flippers/flipInX.css"
import "animate.css/source/flippers/flip.css"

// Todo: 把__config__数据从bundle分离出来，异步请求数据
// 先渲染出Loading
declare const __config__: Pages

const App = React.lazy(async () => {
  await timeout()
  const { JAbout, JBlog, JHome, JLinks, JProject } = __config__
  return {
    default: () => (
      <Pages
        JAbout={JAbout}
        JBlog={JBlog}
        JHome={JHome}
        JLinks={JLinks}
        JProject={JProject}
      />
    )
  }
})

ReactDOM.render(
  <React.Suspense fallback={<Loading />}>
    <App />
  </React.Suspense>,
  document.getElementById("root")
)
