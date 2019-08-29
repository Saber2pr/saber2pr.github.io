import React from "react"
import ReactDOM from "react-dom"

import "normalize.css"

import "animate.css/source/_base.css"

import "animate.css/source/fading_entrances/fadeIn.css"
import "animate.css/source/fading_entrances/fadeInUp.css"

import "animate.css/source/bouncing_entrances/bounceInDown.css"
import "animate.css/source/bouncing_entrances/bounceInRight.css"

import "animate.css/source/flippers/flipInX.css"
import "animate.css/source/flippers/flip.css"

// /

import Pages from "./app"
import { Loading } from "./components"
import { request } from "./request"

const App = React.lazy(async () => {
  const config = await request()
  const { JAbout, JBlog, JHome, JLinks, JProject } = config
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
