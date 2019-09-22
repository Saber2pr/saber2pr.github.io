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
import { requestConfig, createTree } from "./request"
import { welcome } from "./utils"
import { AccessCode, AccessToken } from "@saber2pr/rc-gitment"
import { origin } from "./config"

const App = React.lazy(async () => {
  welcome()
  if (AccessCode.getCode()) {
    if (!AccessToken.checkAccess()) {
      const accessToken = await AccessToken.getAccessToken(
        AccessToken.createAccessTokenUrl(
          AccessCode.getCode(),
          origin.client_id,
          origin.client_secret
        )
      )
      AccessToken.saveAccessToken(accessToken)
    }
  }
  const config = await requestConfig()
  const tree = await createTree()
  welcome.time(config.lastDate)
  return {
    default: () => <Pages {...config} JBlog={tree} />
  }
})

ReactDOM.render(
  <React.Suspense fallback={<Loading />}>
    <App />
  </React.Suspense>,
  document.getElementById("root")
)
