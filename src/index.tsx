declare const LOADING: { destroy: Function }

import 'normalize.css'
import 'animate.css/source/flippers/flipInX.css'
import './style/animation.less'
import './style/shadow.less'
import './style/components.less'

import React from 'react'
import ReactDOM from 'react-dom'

// /
import Pages from './app'
import { checkUpdate, ErrorBoundary, Loading } from './components'
import { request, requestContent } from './request'
import {
  collect,
  PWAInstaller,
  requestLongListTask,
  welcome,
  whenInDEV,
} from './utils'

const App = React.lazy(async () => {
  welcome()
  const homeInfo = await request('home')
  const aboutInfo = await request('about')
  const blogTree = await request('blog')

  // for cache backend
  requestLongListTask(collect(blogTree), item =>
    requestContent(item.path + '.md')
  )

  return {
    default: () => (
      <Pages homeInfo={homeInfo} aboutInfo={aboutInfo} blogTree={blogTree} />
    ),
  }
})

ReactDOM.render(
  <ErrorBoundary>
    <React.Suspense fallback={<Loading />}>
      <App />
    </React.Suspense>
  </ErrorBoundary>,
  document.getElementById('root')
)

window.addEventListener('load', async () => {
  if (whenInDEV()) return

  if ('serviceWorker' in navigator) {
    await PWAInstaller()
    checkUpdate(null, true)
  }

  LOADING.destroy()
})
