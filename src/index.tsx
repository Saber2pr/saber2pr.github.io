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

import "./style/animation.less"
import "./style/shadow.less"

// /

import Pages from "./app"
import { Loading } from "./components"
import { requestConfig } from "./request"
import { welcome } from "./utils"

const App = React.lazy(async () => {
  welcome()
  const config = await requestConfig()
  return {
    default: () => <Pages {...config} />
  }
})

ReactDOM.render(
  <React.Suspense fallback={<Loading />}>
    <App />
  </React.Suspense>,
  document.getElementById("root")
)
